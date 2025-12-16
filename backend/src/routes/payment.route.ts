import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware';
import * as PaymentController from '../controllers/payment.controller';

const router = express.Router();

router.post('/create-intent', protectRoute, PaymentController.createIntent);

// no protection needed for this route beacuse stripe validates via signature
router.post('/webhook', PaymentController.handleWebHook);

export default router;
