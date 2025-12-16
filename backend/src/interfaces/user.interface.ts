import type { IAddress } from './address.interface';

export interface IUser {
  name: string;
  email: string;
  imageUrl: string;
  clerkId: string;
  stripeCustomerId: string;
  addresses: IAddress[];
  wishlist: string[];
}
