import type { Types } from 'mongoose';
import type { IOrderItem } from './order-item.interface';
import type { IShippingAddress } from './shippingAddress.interface';

export interface IOrder {
  user: string | Types.ObjectId;
  clerkId: string;
  items: IOrderItem[];
  paymentResult: {
    id: string;
    status: string;
  };
  status: 'pending' | 'shipped' | 'delivered';
  totalPrice: number;
  shippingAddress: IShippingAddress;
  deliveredAt: Date;
  shippedAt: Date;
}
