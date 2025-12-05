import express from 'express';
import * as ReviewController from '../controllers/review.controller';
import { protectRoute } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { CreateReviewDto } from '../dtos/review/create-review.dto';

const router = express.Router();

router.use(protectRoute);

router.post('/', validate(CreateReviewDto), ReviewController.createReview);

export default router;
