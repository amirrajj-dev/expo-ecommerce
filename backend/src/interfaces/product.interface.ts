export interface IProduct {
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
