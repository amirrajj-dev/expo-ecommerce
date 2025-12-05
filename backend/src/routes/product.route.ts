import express from 'express';
import * as ProductController from '../controllers/product.controller';
import * as AdminController from '../controllers/admin.controller';
import { protectRoute } from '../middlewares/auth.middleware';

const router = express.Router();

router.use(protectRoute);

router.get('/', AdminController.getAllProducts);
router.get('/:id', ProductController.getProductById);

export default router;
