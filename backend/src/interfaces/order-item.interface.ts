import type { Types } from 'mongoose';

export interface IOrderItem {
  product: string | Types.ObjectId;
  price: number;
  quantity: number;
  image: string;
  name: string;
}
