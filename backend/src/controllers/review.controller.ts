import type { Request, Response } from 'express';
import type { CreateReviewInput } from '../dtos/review/create-review.dto';
import { Product } from '../models/product.model';
import { ApiResponseHelper } from '../helpers/api.helper';
import { Order } from '../models/order.model';
import logger from '../logging/logger';
import { Review } from '../models/review.model';
import { redis } from '../libs/redis';

export const createReview = async (req: Request<{}, {}, CreateReviewInput>, res: Response) => {
  try {
    logger.info('creating review...');
    const { orderId, productId, rating } = req.body;
    const user = req.user;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(ApiResponseHelper.notFound('product not found', req.path));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(ApiResponseHelper.notFound('order not found', req.path));
    }

    if (order.clerkId !== user.clerkId) {
      return res.status(403).json(ApiResponseHelper.forbidden('not authorized to review'));
    }

    // Only delivered orders can be reviewed
    if (order.status !== 'delivered') {
      return res
        .status(400)
        .json(ApiResponseHelper.badRequest('only delivered orders can be reviewed'));
    }

    const productInOrder = order.items.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!productInOrder) {
      return res.status(400).json(ApiResponseHelper.badRequest('product not found in order'));
    }

    // Prevent duplicate reviews
    const existingReview = await Review.exists({ orderId, productId, userId: user._id });
    if (existingReview) {
      return res.status(400).json(ApiResponseHelper.badRequest('already reviewed'));
    }

    const review = await Review.create({
      productId,
      userId: user._id,
      orderId,
      rating,
    });

    logger.info('review created successfully');

    // Atomic rating update using MongoDB pipeline
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      [
        {
          $set: {
            totalReviews: { $add: ['$totalReviews', 1] },
            ratingSum: { $add: ['$ratingSum', rating] },
          },
        },
        {
          $set: {
            averageRating: {
              $divide: [{ $add: ['$ratingSum', rating] }, { $add: ['$totalReviews', 1] }],
            },
          },
        },
      ],
      { new: true },
    );

    logger.info('product rating updated atomically');

    await redis.unlink(`product:${productId}`, `products:all`, `user:${user._id}:orders`);

    return res
      .status(201)
      .json(
        ApiResponseHelper.created(
          'review created successfully',
          { review, updatedProduct },
          req.path,
        ),
      );
  } catch (error) {
    logger.error('error creating review', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error creating review', req.path, error));
  }
};
