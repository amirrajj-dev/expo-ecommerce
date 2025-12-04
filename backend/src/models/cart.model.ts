import mongoose, { Document, Model, Schema } from 'mongoose';
import type { ICart } from '../interfaces/cart.interface';
import type { ICartItem } from '../interfaces/cart-item.interface';

export interface ICartDocument extends ICart, Document {}

export const cartItemSchema = new mongoose.Schema<ICartItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  quantity: {
    required: true,
    min: 1,
    default: 1,
    type: Number,
  },
});

const cartSchema = new Schema<ICartDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    clerkId: { type: String, required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

export const Cart: Model<ICartDocument> =
  mongoose.models.cart || mongoose.model<ICartDocument>('cart', cartSchema);
