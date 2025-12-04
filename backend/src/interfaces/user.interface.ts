import type { HydratedDocument, Types } from 'mongoose';
import type { IAddress } from './address.interface';

export interface IUser {
  name: string;
  email: string;
  imageUrl: string;
  clerkId: string;
  addresses: Types.DocumentArray<HydratedDocument<IAddress>>;
  wishlist: Types.Array<Types.ObjectId>;
}
