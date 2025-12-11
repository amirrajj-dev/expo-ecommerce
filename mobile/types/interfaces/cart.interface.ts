import { BaseDocument } from "./base.interface";
import { Product } from "./product.interface";

export interface CartItem {
  product: Product;
  quantity: number;
  _id?: string;
}

export interface Cart extends BaseDocument {
  user: string;
  clerkId: string;
  items: CartItem[];
}