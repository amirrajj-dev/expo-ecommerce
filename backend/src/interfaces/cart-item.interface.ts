import type { Types } from 'mongoose';
import type { IProduct } from './product.interface';

export interface ICartItem {
  product: string | Types.ObjectId;
  quantity: number;
}

export interface ICartItemWithProduct {
  product: IProduct;
  quantity: number;
}
