import z from 'zod';

export const AddAddressDto = z.object({
  label: z
    .string()
    .min(3)
    .max(50)
    .transform((str) => str.trim()),
  fullName: z
    .string()
    .min(5)
    .max(60)
    .transform((str) => str.trim()),
  streetAddress: z
    .string()
    .min(5)
    .transform((str) => str.trim()),
  city: z
    .string()
    .min(4)
    .max(30)
    .transform((str) => str.trim()),
  state: z
    .string()
    .min(3)
    .max(40)
    .transform((str) => str.trim()),
  zipCode: z
    .string()
    .min(3)
    .max(50)
    .transform((str) => str.trim()),
  phoneNumber: z
    .string()
    .min(3)
    .max(50)
    .transform((str) => str.trim()),
  isDefault: z.boolean().optional(),
});

export type AddAddressInput = z.infer<typeof AddAddressDto>;
