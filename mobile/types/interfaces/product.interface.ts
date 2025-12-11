import { BaseDocument } from "./base.interface";

export interface ProductImage {
  imageUrl: string;
  publicId: string;
  _id?: string;
}

export interface Product extends BaseDocument {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: ProductImage[];
  averageRating: number;
  totalReviews: number;
  ratingSum: number;
}