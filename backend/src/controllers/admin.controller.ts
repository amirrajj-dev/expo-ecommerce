import type { Request, Response } from 'express';
import { ApiResponseHelper } from '../helpers/api.helper';
import { deleteFromCloudinary, uploadToCloudinary } from '../libs/cloudinary';
import fs from 'fs/promises';
import logger from '../logging/logger';
import { Product } from '../models/product.model';
import type { CreateProductInput } from '../dtos/products/create-product.dto';
import type { UpdateProductInput } from '../dtos/products/update-product.dto';
import { redis } from '../libs/redis';
import { Order } from '../models/order.model';
import type { UpdateOrderStatusInput } from '../dtos/orders/update-order-status.dto';
import { User } from '../models/user.model';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    logger.info('fetching products ...');
    const cached = await redis.get('products:all');
    if (cached) {
      logger.info('Returning products from cache');
      return res
        .status(200)
        .json(ApiResponseHelper.success('Products fetched (cache)', JSON.parse(cached), req.path));
    }
    const products = await Product.find().sort({ createdAt: -1 });
    await redis.set('products:all', JSON.stringify(products), 'EX', 60 * 60 * 24); // 24H
    return res
      .status(200)
      .json(ApiResponseHelper.success('products fetched succesfully', products, req.path));
  } catch (error) {
    logger.error('error fetching products', error instanceof Error ? error.message : error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to fetch products', req.path, error));
  }
};

export const createProduct = async (req: Request<{}, {}, CreateProductInput>, res: Response) => {
  try {
    logger.info('creating product ...');
    const { name, category, description, price, stock } = req.body;

    if (!req.files?.length) {
      return res
        .status(400)
        .json(ApiResponseHelper.badRequest('At least one image is required', req.path));
    }

    const files = req.files as Express.Multer.File[];

    if (files.length > 3) {
      return res.status(400).json(ApiResponseHelper.badRequest('Max 3 images allowed', req.path));
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const uploaded = await uploadToCloudinary(file);
        await fs.unlink(file.path); // remove local file after upload
        return {
          imageUrl: uploaded.secure_url,
          publicId: uploaded.public_id,
        };
      }),
    );

    logger.info('images uploaded succesfully');

    const product = await Product.create({
      name,
      description,
      stock,
      price,
      category,
      images: uploadedImages,
    });

    logger.info(`product ${product.name} created`);
    await redis.del('products:all');

    return res.status(201).json(ApiResponseHelper.created('product created', product, req.path));
  } catch (error) {
    logger.error('Create product error', error instanceof Error ? error.message : error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('Failed to create product', req.path, error));
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, UpdateProductInput>,
  res: Response,
) => {
  try {
    logger.info('updating product ...');
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json(ApiResponseHelper.notFound('Product not found', req.path));
    }

    const { name, category, description, price, stock } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);

    const files = req.files as Express.Multer.File[];

    if (files?.length) {
      if (files.length > 3) {
        return res.status(400).json(ApiResponseHelper.badRequest('Max 3 images allowed', req.path));
      }

      // Upload new images first
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const uploaded = await uploadToCloudinary(file);
          await fs.unlink(file.path);
          return { imageUrl: uploaded.secure_url, publicId: uploaded.public_id };
        }),
      );

      // then Delete existing images from Cloudinary
      await Promise.all(
        product.images.map(async (img) => {
          await deleteFromCloudinary(img.publicId, 'image');
        }),
      );

      product.images = uploadedImages;
    }

    await product.save();
    await redis.del('products:all');

    return res
      .status(200)
      .json(ApiResponseHelper.success('Product updated successfully', product, req.path));
  } catch (error) {
    logger.error('Update product error:', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('Failed to update product', req.path, error));
  }
};

export const deleteProduct = async (req: Request<{ id: string }>, res: Response) => {
  try {
    logger.info('deleting product ...');
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json(ApiResponseHelper.notFound('Product not found', req.path));
    }
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (img) => {
          await deleteFromCloudinary(img.publicId, 'image');
        }),
      );
      logger.info('product images deleted');
    }
    await Product.findByIdAndDelete(id);
    await redis.del('products:all');
    return res
      .status(200)
      .json(ApiResponseHelper.success('product deleted successfully', null, req.path));
  } catch (error) {
    logger.error('error deleting product', error instanceof Error ? error.message : error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to delete product', req.path, error));
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    logger.info('fetching orders ...');
    const cached = await redis.get('orders:all');
    if (cached) {
      logger.info('Returning orders from cache');
      return res
        .status(200)
        .json(ApiResponseHelper.success('Orders fetched (cache)', JSON.parse(cached), req.path));
    }
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    await redis.set('orders:all', JSON.stringify(orders), 'EX', 60 * 60 * 12);
    return res
      .status(200)
      .json(ApiResponseHelper.success('orders fetched succesfully', orders, req.path));
  } catch (error) {
    logger.error('error fetching orders', error instanceof Error ? error.message : error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to fetch orders', req.path, error));
  }
};

export const updateOrderStatus = async (
  req: Request<{ orderId: string }, {}, UpdateOrderStatusInput>,
  res: Response,
) => {
  try {
    logger.info('updating order status...');
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(ApiResponseHelper.notFound('order not found', req.path));
    }
    const { status } = req.body;
    order.status = status;
    if (status === 'shipped' && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }
    await order.save();
    await redis.del('orders:all');

    return res
      .status(200)
      .json(ApiResponseHelper.success('order updated succesfully', order, req.path));
  } catch (error) {
    logger.error('Update order status error:', error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('Failed to update order status', req.path, error));
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    logger.info('fetching customers...');
    const cached = await redis.get('users:all');
    if (cached) {
      logger.info('Returning customers from cache');
      return res
        .status(200)
        .json(ApiResponseHelper.success('Customers fetched (cache)', JSON.parse(cached), req.path));
    }
    const customers = await User.find().sort({ createdAt: -1 });
    await redis.set('users:all', JSON.stringify(customers), 'EX', 60 * 60 * 24);
    return res
      .status(200)
      .json(ApiResponseHelper.success('customers fetched succesfully', customers, req.path));
  } catch (error) {
    logger.error('error fetching customers', error instanceof Error ? error.message : error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to fetch customers', req.path, error));
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    logger.info('fetching dashboard stats ...');
    const cached = await redis.get('dashboard:stats');
    if (cached) {
      logger.info('Returning dashboard stats from cache');
      return res
        .status(200)
        .json(
          ApiResponseHelper.success(
            'Dashboard stats fetched (cache)',
            JSON.parse(cached),
            req.path,
          ),
        );
    }
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: '$totalPrice',
          },
        },
      },
    ]);
    const totalRevenue = revenueResult[0].total || 0;
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const stats = { totalOrders, totalRevenue, totalCustomers, totalProducts };
    await redis.set('dashboard:stats', JSON.stringify(stats), 'EX', 60 * 5);
    return res
      .status(200)
      .json(ApiResponseHelper.success('dashboard stats fetched successfully', stats, req.path));
  } catch (error) {
    logger.error('error fetching dashboard stats', error instanceof Error ? error.message : error);
    return res
      .status(500)
      .json(ApiResponseHelper.internal('failed to fetch dashboard stats', req.path, error));
  }
};
