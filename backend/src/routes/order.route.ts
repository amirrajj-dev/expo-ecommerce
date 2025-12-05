import express from 'express';
import * as OrderController from '../controllers/order.controller';
import { protectRoute } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { CreateOrderDto } from '../dtos/orders/create-order.dto';

const router = express.Router();

router.use(protectRoute);
router.get('/', OrderController.getUserOrders);
router.post('/', validate(CreateOrderDto), OrderController.createOrder);

export default router;
