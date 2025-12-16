import type mongoose from 'mongoose';

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: IProductImage[];
  averageRating: number;
  totalReviews: number;
  ratingSum: number;
}

export interface IProductImage {
  imageUrl: string;
  publicId: string;
}
