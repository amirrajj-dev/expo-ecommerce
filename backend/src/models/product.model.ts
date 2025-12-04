import mongoose, { Document, Model, Schema } from 'mongoose';
import type { IProduct, IProductImage } from '../interfaces/product.interface';

export interface IProductDocument extends IProduct, Document {}

const imageSchema = new mongoose.Schema<IProductImage>({
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true, // use for delete images from cloudinary :)
  },
});

const productsSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },

    price: { type: Number, required: true, min: 0 },

    stock: { type: Number, required: true, min: 0, default: 0 },

    category: { type: String, required: true },

    images: [imageSchema],

    averageRating: { type: Number, default: 0, min: 0, max: 5 },

    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Product: Model<IProductDocument> =
  mongoose.models.product || mongoose.model<IProductDocument>('product', productsSchema);
