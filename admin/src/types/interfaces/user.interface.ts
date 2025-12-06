export interface Address {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  clerkId: string;
  addresses: Address[];
  wishlist: string[]; // Product IDs
  createdAt?: string;
  updatedAt?: string;
}