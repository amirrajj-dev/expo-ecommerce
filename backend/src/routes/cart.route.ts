import express from 'express';
import * as CartController from '../controllers/cart.controller';
import { protectRoute } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { AddToCartDto } from '../dtos/cart/add-to-cart.dto';
import { UpdateCartDto } from '../dtos/cart/update-cart.dto';

const router = express.Router();

router.use(protectRoute);

router.get('/', CartController.getCart);
router.post('/', validate(AddToCartDto), CartController.addToCart);
router.put('/:productId', validate(UpdateCartDto), CartController.updateCart);
router.delete('/:productId', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

export default router;
