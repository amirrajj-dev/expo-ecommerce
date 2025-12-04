import express from 'express';
import * as UserController from '../controllers/user.controller';
import { protectRoute } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { AddAddressDto } from '../dtos/address/add-address.dto';
import { UpdateAddressDto } from '../dtos/address/update-address.dto';

const router = express.Router();

router.use(protectRoute);

// ADDRESS
router.post('/addresses', validate(AddAddressDto), UserController.addAddress);
router.get('/addresses', UserController.getAddresses);
router.put('/addresses/:addressId', validate(UpdateAddressDto), UserController.updateAddress);
router.delete('/addresses/:addressId', UserController.deleteAddress);

// WISHLIST
router.get('/wishlist', UserController.getWishList);
router.post('/wishlist', UserController.addToWishList);
router.delete('/wishlist/:productId', UserController.deleteProductFromWishList);

export default router;
