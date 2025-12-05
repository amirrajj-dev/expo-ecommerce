import type { Request, Response } from 'express';
import logger from '../logging/logger';
import { ApiResponseHelper } from '../helpers/api.helper';
import type { CreateOrderInput } from '../dtos/orders/create-order.dto';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import mongoose from 'mongoose';
import { redis } from '../libs/redis';
import { Review } from '../models/review.model';

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    logger.info('fetching user orders...');
    const user = req.user;
    const cacheKey = `user:${user._id}:orders`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.info('Returning orders from cache');
      return res
        .status(200)
        .json(ApiResponseHelper.success('orders fetched (cache)', JSON.parse(cached), req.path));
    }
    const orders = await Order.find({ clerkId: user.clerkId })
      .populate('items.product')
      .sort({ createdAt: -1 });
    const ordersWithReviewedStatus = await Promise.all(
      orders.map(async (order) => {
        const review = await Review.exists({ orderId: order._id });
        return {
          ...order.toObject(),
          hasReviewed: !!review,
        };
      }),
    );
    await redis.set(cacheKey, JSON.stringify(ordersWithReviewedStatus), 'EX', 60 * 60 * 12);
    logger.info('orders fetched succesfully');
    return res
      .status(200)
      .json(
        ApiResponseHelper.success(
          'orders fetched succesfully',
          { orders: ordersWithReviewedStatus },
          req.path,
        ),
      );
  } catch (error) {
    logger.error('failed to fetch user orders', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to fetch user orders', req.path, error));
  }
};

export const createOrder = async (req: Request<{}, {}, CreateOrderInput>, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    logger.info('creating an order...');
    const { items, paymentResult, shippingAddress, totalPrice } = req.body;
    const user = req.user;

    let verifiedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        await session.abortTransaction();
        return res.status(404).json(ApiResponseHelper.notFound(`product not found`, req.path));
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res
          .status(400)
          .json(ApiResponseHelper.badRequest(`insufficient stock for ${product.name}`, req.path));
      }

      verifiedTotal += product.price * item.quantity;
    }

    if (verifiedTotal !== totalPrice) {
      await session.abortTransaction();
      return res
        .status(400)
        .json(ApiResponseHelper.badRequest('price tampering detected', req.path));
    }

    const [order] = await Order.create(
      [
        {
          user: user._id,
          clerkId: user.clerkId,
          items,
          shippingAddress,
          paymentResult,
          totalPrice: verifiedTotal,
        },
      ],
      { session },
    );

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session },
      );
    }

    await session.commitTransaction();

    logger.info('order created successfully & inventory updated');

    await redis.unlink(`user:${user._id}:orders`, 'products:all', 'dashboard:stats', 'orders:all');
    for (const item of items) {
      await redis.unlink(`product:${item.product.toString()}`);
    }

    return res.status(201).json(ApiResponseHelper.created('order created', order, req.path));
  } catch (error) {
    logger.error('failed to create order', error);
    await session.abortTransaction();

    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to create order', req.path, error));
  } finally {
    session.endSession();
  }
};
