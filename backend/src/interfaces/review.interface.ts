import type { Types } from 'mongoose';

export interface IReview {
  productId: string | Types.ObjectId;
  orderId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  rating: number;
}
