export interface ProductImage {
  imageUrl: string;
  publicId: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: ProductImage[];
  averageRating: number;
  totalReviews: number;
  ratingSum: number;
  createdAt?: string;
  updatedAt?: string;
}