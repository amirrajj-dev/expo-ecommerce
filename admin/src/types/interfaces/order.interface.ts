import type { Product } from "./product.interface";
import type { User } from "./user.interface";

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

export interface OrderItem {
  product: Product | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface Order {
  _id: string;
  user: User | string;
  clerkId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentResult?: {
    id: string;
    status: string;
  };
  totalPrice: number;
  status: OrderStatus;
  deliveredAt?: string;
  shippedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}