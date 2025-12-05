import type { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { ApiResponseHelper } from '../helpers/api.helper';
import logger from '../logging/logger';
import { redis } from '../libs/redis';

export const getProductById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;

    logger.info(`fetching product ${id}`);

    const cached = await redis.get(cacheKey);
    if (cached) {
      logger.info(`returned product ${id} from cache`);
      return res
        .status(200)
        .json(ApiResponseHelper.success('product fetched (cache)', JSON.parse(cached), req.path));
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json(ApiResponseHelper.notFound('product not found', req.path));
    }

    await redis.set(cacheKey, JSON.stringify(product), 'EX', 60 * 60 * 12);

    logger.info(`product ${id} cached & returned`);

    return res
      .status(200)
      .json(ApiResponseHelper.success('product fetched successfully', product, req.path));
  } catch (error) {
    logger.error('error fetching single product', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('error fetching single product', req.path, error));
  }
};
