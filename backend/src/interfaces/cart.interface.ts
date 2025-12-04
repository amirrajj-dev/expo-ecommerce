import type { Types } from 'mongoose';
import type { ICartItem } from './cart-item.interface';

export interface ICart {
  user: string | Types.ObjectId;
  clerkId: string;
  items: ICartItem[];
}
