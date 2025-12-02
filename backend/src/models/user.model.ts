import mongoose, { Document, Model } from 'mongoose';
import type { IUser } from '../interfaces/user.interface';
import type { IAddress } from '../interfaces/address.interface';

export interface IUserDocument extends IUser, Document {}

const addressesSchema = new mongoose.Schema<IAddress>({
  label: {
    type: String,
    required: true,
  },
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
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    addresses: [addressesSchema],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const User: Model<IUserDocument> =
  mongoose.models.user || mongoose.model<IUserDocument>('user', userSchema);
