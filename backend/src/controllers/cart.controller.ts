import type { Request, Response } from 'express';
import { Cart } from '../models/cart.model';
import logger from '../logging/logger';
import { ApiResponseHelper } from '../helpers/api.helper';
import type { AddToCartInput } from '../dtos/cart/add-to-cart.dto';
import { Product } from '../models/product.model';
import type { UpdateCartInput } from '../dtos/cart/update-cart.dto';
import { redis } from '../libs/redis';

export const getCart = async (req: Request, res: Response) => {
  try {
    logger.info('fetching user cart...');
    const cacheKey = `cart:${req.user.clerkId}`;
    const cachedCart = await redis.get(cacheKey);
    if (cachedCart) {
      logger.info('Returning cart from cache');
      return res
        .status(200)
        .json(
          ApiResponseHelper.success(
            'cart fetched successfully (cache)',
            JSON.parse(cachedCart),
            req.path,
          ),
        );
    }

    let cart = await Cart.findOne({ clerkId: req.user.clerkId }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ clerkId: req.user.clerkId, items: [] });
    }
    await redis.set(cacheKey, JSON.stringify(cart), 'EX', 60 * 60 * 12);
    return res
      .status(200)
      .json(ApiResponseHelper.success('cart fetched successfully', cart, req.path));
  } catch (error) {
    logger.error('error fetching user cart', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error fetching user cart', req.path, error));
  }
};

export const addToCart = async (req: Request<{}, {}, AddToCartInput>, res: Response) => {
  try {
    logger.info('adding item to the cart ...');
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(ApiResponseHelper.notFound('product not found', req.path));
    }

    // Atomically increment existing item quantity
    const updatedCart = await Cart.findOneAndUpdate(
      {
        clerkId: req.user.clerkId,
        'items.product': productId,
        'items.quantity': { $lt: product.stock },
        $expr: {
          $lt: [
            {
              $add: [
                {
                  $arrayElemAt: [
                    '$items.quantity',
                    { $indexOfArray: ['$items.product', productId] },
                  ],
                },
                quantity,
              ],
            },
            product.stock + 1,
          ],
        },
      },
      { $inc: { 'items.$.quantity': quantity } },
      { new: true },
    );

    if (updatedCart) {
      logger.info('existing cart item quantity incremented atomically');
      await redis.unlink(`cart:${req.user.clerkId}`);
      return res
        .status(201)
        .json(ApiResponseHelper.created('cart updated successfully', updatedCart, req.path));
    }

    // If item not in cart, push it atomically
    const cart = await Cart.findOneAndUpdate(
      { clerkId: req.user.clerkId },
      { $push: { items: { product: productId, quantity } } },
      { new: true, upsert: true },
    );
    await redis.unlink(`cart:${req.user.clerkId}`);
    logger.info('new item added to cart atomically');
    return res
      .status(201)
      .json(ApiResponseHelper.created('item added to the cart', cart, req.path));
  } catch (error) {
    logger.error('error adding item to the cart', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error adding item to the cart', req.path, error));
  }
};

export const updateCart = async (
  req: Request<{ productId: string }, {}, UpdateCartInput>,
  res: Response,
) => {
  try {
    logger.info('updating cart ...');
    const { quantity } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(ApiResponseHelper.notFound('product not found', req.path));
    }
    if (quantity > product.stock) {
      return res.status(400).json(ApiResponseHelper.badRequest('insufficient stock', req.path));
    }

    // Atomic update or removal if quantity <= 0
    let cart;
    if (quantity <= 0) {
      cart = await Cart.findOneAndUpdate(
        { clerkId: req.user.clerkId },
        { $pull: { items: { product: productId } } },
        { new: true },
      );
    } else {
      cart = await Cart.findOneAndUpdate(
        { clerkId: req.user.clerkId, 'items.product': productId },
        { $set: { 'items.$.quantity': quantity } },
        { new: true },
      );
    }

    if (!cart) {
      return res.status(404).json(ApiResponseHelper.notFound('cart or item not found', req.path));
    }

    await redis.unlink(`cart:${req.user.clerkId}`);
    return res
      .status(200)
      .json(ApiResponseHelper.success('cart updated successfully', cart, req.path));
  } catch (error) {
    logger.error('error updating cart', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to update cart', req.path, error));
  }
};

export const removeFromCart = async (req: Request<{ productId: string }>, res: Response) => {
  try {
    logger.info('removing item from cart ...');
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { clerkId: req.user.clerkId },
      { $pull: { items: { product: productId } } },
      { new: true },
    );

    if (!cart) {
      return res.status(404).json(ApiResponseHelper.notFound('cart or item not found', req.path));
    }
    await redis.unlink(`cart:${req.user.clerkId}`);
    return res
      .status(200)
      .json(ApiResponseHelper.success('item removed from cart successfully', cart, req.path));
  } catch (error) {
    logger.error('error deleting item from cart', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to remove item from cart', req.path, error));
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    logger.info('clearing cart ...');

    const cart = await Cart.findOneAndUpdate(
      { clerkId: req.user.clerkId },
      { $set: { items: [] } },
      { new: true },
    );

    if (!cart) {
      return res.status(404).json(ApiResponseHelper.notFound('cart not found', req.path));
    }
    await redis.unlink(`cart:${req.user.clerkId}`);
    return res
      .status(200)
      .json(ApiResponseHelper.success('cart cleared successfully', cart, req.path));
  } catch (error) {
    logger.error('failed to clear cart', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to clear cart', req.path, error));
  }
};
