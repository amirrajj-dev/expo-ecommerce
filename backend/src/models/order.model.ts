import mongoose, { Document, Model } from 'mongoose';
import type { IOrder } from '../interfaces/order.interface';
import type { IOrderItem } from '../interfaces/order-item.interface';
import type { IShippingAddress } from '../interfaces/shippingAddress.interface';

const orderItemSchema = new mongoose.Schema<IOrderItem>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
});

export interface IOrderDocument extends IOrder, Document {}

const shippingAddressSchema = new mongoose.Schema<IShippingAddress>({
  fullName: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    reuqired: true,
  },
  phoneNumber: {
    type: String,
    requried: true,
  },
});

const orderSchema = new mongoose.Schema<IOrderDocument>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    clerkId: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered'],
      default: 'pending',
    },
    deliveredAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Order: Model<IOrderDocument> =
  mongoose.models.order || mongoose.model<IOrderDocument>('order', orderSchema);
