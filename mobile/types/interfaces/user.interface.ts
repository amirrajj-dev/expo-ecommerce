import { BaseDocument } from "./base.interface";

export interface Address {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
  _id?: string;
}

export interface User extends BaseDocument {
  name: string;
  email: string;
  imageUrl: string;
  clerkId: string;
  addresses: Address[];
  wishlist: string[];
}