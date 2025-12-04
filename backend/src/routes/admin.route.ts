import express from 'express';
import * as AdminController from '../controllers/admin.controller';
import { adminRoute, protectRoute } from '../middlewares/auth.middleware';
import upload from '../middlewares/multer.middleware';
import { validate } from '../middlewares/validation.middleware';
import { CreateProductDto } from '../dtos/products/create-product.dto';
import { UpdateProductDto } from '../dtos/products/update-product.dto';
import { UpdateOrderStatusDto } from '../dtos/orders/update-order-status';

const router = express.Router();

router.use(protectRoute, adminRoute);

// PRODUCTS
router.post(
  '/products',
  validate(CreateProductDto),
  upload.array('images', 3),
  AdminController.createProduct,
);
router.get('/products', AdminController.getAllProducts);
router.put(
  '/products/:id',
  validate(UpdateProductDto),
  upload.array('images', 3),
  AdminController.updateProduct,
);
router.delete('/products/:id', AdminController.deleteProduct);

// ORDERS
router.get('/orders', AdminController.getAllOrders);
router.patch(
  '/orders/:orderId/status',
  validate(UpdateOrderStatusDto),
  AdminController.updateOrderStatus,
);

// CUSTOMERS
router.get('/customers', AdminController.getAllCustomers);

// STATS
router.get('/stats', AdminController.getDashboardStats);

export default router;
