import { BaseDocument } from "./base.interface";
import { Product } from "./product.interface";

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  _id?: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
  _id?: string;
}

export interface PaymentResult {
  id?: string;
  status?: string;
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered';

export interface Order extends BaseDocument {
  user: string;
  clerkId: string;
  items: OrderItem[];
  paymentResult: PaymentResult
  status: OrderStatus;
  totalPrice: number;
  shippingAddress: ShippingAddress;
  deliveredAt?: Date; 
  shippedAt?: Date;   
  hasReviewed: boolean;
}