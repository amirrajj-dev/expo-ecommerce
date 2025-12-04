import type { Types } from 'mongoose';

export interface ICartItem {
  product: string | Types.ObjectId;
  quantity: number;
}
