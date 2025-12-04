import mongoose, { Document, Model } from 'mongoose';
import type { IReview } from '../interfaces/review.interface';

export interface IReviewDocument extends IReview, Document {}

const reviewSchema = new mongoose.Schema<IReviewDocument>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'product' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true },
);

export const Review: Model<IReviewDocument> =
  mongoose.models.review || mongoose.model<IReviewDocument>('review', reviewSchema);
