import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { ENV } from '../configs/env';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import type { IAddress } from '../interfaces/address.interface';
import type { ICartItemWithProduct } from '../interfaces/cart-item.interface';
import logger from '../logging/logger';
import { ApiResponseHelper } from '../helpers/api.helper';
import { redis } from '../libs/redis';

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY as string);

interface IValidItem {
  product: string;
  image: string;
  name: string;
  quantity: number;
  price: number;
}

export const createIntent = async (
  req: Request<{}, {}, { cartItems: ICartItemWithProduct[]; shippingAddress: IAddress }>,
  res: Response,
) => {
  try {
    logger.info('creating intent ...');
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;
    let subTotal = 0;
    let validatedItems: IValidItem[] = [];
    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        logger.info('product not found');
        return res
          .status(404)
          .json(ApiResponseHelper.notFound(`Product ${item.product.name} Not Found`, req.path));
      }
      if (product.stock < item.quantity) {
        logger.info(`Insufficent stock for ${product.name}`);
        return res
          .status(400)
          .json(ApiResponseHelper.badRequest(`Insufficent stock for ${product.name}`));
      }
      subTotal += product.price * item.quantity;
      validatedItems.push({
        image: product.images[0]?.imageUrl as string,
        name: product.name,
        price: product.price,
        product: product._id.toString(),
        quantity: item.quantity,
      });
    }
    const shipping = 10.0;
    const tax = subTotal * 0.08;
    const total = subTotal + shipping + tax;

    if (total <= 0) {
      logger.info('Invalid Order Total');
      return res.status(400).json(ApiResponseHelper.badRequest('Invalid Order Total', req.path));
    }

    // find or create stripe customer
    let customer;
    if (user.stripeCustomerId) {
      logger.info('finding customer');
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      logger.info('creating customer');
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: user.clerkId,
          userId: user._id.toString(),
        },
      });
      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: customer.id,
      });
    }

    logger.info('creating payment intent ...');

    // create payment intent
    const payment = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // in cents
      currency: 'usd',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true, // apple pay | google pay
      },
      metadata: {
        clerkId: user.clerkId,
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total.toFixed(2),
      },
    });
    logger.info('payment intent created successfully');
    return res.status(200).json(
      ApiResponseHelper.success(
        'payment intent created successfully',
        {
          clientSecret: payment.client_secret,
        },
        req.path,
      ),
    );
  } catch (error) {
    logger.info('error in creating payment intent', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error creating payment intent', req.path, error));
  }
};

export const handleWebHook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      req.body,
      sig,
      ENV.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    logger.error('❌ Stripe webhook signature verification failed', err);
    return res.status(400).json(ApiResponseHelper.badRequest('Invalid signature', req.path));
  }

  if (event.type !== 'payment_intent.succeeded') {
    return res
      .status(200)
      .json(
        ApiResponseHelper.success(
          `payment type is ${event.type || 'unkown type'}`,
          { received: true },
          req.path,
        ),
      );
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  try {
    logger.info(`💰 Payment succeeded: ${paymentIntent.id}`);

    const { userId, clerkId, orderItems, shippingAddress, totalPrice } =
      paymentIntent.metadata ?? {};

    if (!userId || !orderItems || !shippingAddress || !totalPrice) {
      throw new Error('Missing payment intent metadata');
    }

    const existingOrder = await Order.findOne({
      'paymentResult.id': paymentIntent.id,
    });

    if (existingOrder) {
      logger.info(`⚠️ Order already exists for ${paymentIntent.id}`);
      return res
        .status(200)
        .json(
          ApiResponseHelper.success(
            `⚠️ Order already exists for ${paymentIntent.id}`,
            { received: true },
            req.path,
          ),
        );
    }

    const parsedItems = JSON.parse(orderItems);
    const parsedAddress = JSON.parse(shippingAddress);

    const normalizedItems = parsedItems.map((item: any) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const order = await Order.create({
      user: userId,
      clerkId,
      items: normalizedItems,
      shippingAddress: parsedAddress,
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
      },
      totalPrice: Number(totalPrice),
    });

    logger.info(`✅ Order saved: ${order._id}`);

    for (const item of normalizedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    await redis.unlink('products:all', 'dashboard:stats');
    logger.info('🧹 Redis cache cleared');

    return res
      .status(200)
      .json(ApiResponseHelper.success('orde created succesfully', { received: true }, req.path));
  } catch (err) {
    logger.error('🔥 Webhook processing failed', err);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('Webhook processing failed', req.path, err));
  }
};
