import { BaseDocument } from "./base.interface";

export interface Review extends BaseDocument {
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
}