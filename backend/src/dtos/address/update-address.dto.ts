import z from 'zod';

export const UpdateAddressDto = z.object({
  label: z
    .string()
    .min(3)
    .max(50)
    .transform((str) => str.trim())
    .optional(),
  fullName: z
    .string()
    .min(5)
    .max(60)
    .transform((str) => str.trim())
    .optional(),
  streetAddress: z
    .string()
    .min(5)
    .transform((str) => str.trim())
    .optional(),
  city: z
    .string()
    .min(4)
    .max(30)
    .transform((str) => str.trim())
    .optional(),
  state: z
    .string()
    .min(3)
    .max(40)
    .transform((str) => str.trim())
    .optional(),
  zipCode: z
    .string()
    .min(3)
    .max(50)
    .transform((str) => str.trim())
    .optional(),
  phoneNumber: z
    .string()
    .min(3)
    .max(50)
    .transform((str) => str.trim())
    .optional(),
  isDefault: z.boolean().optional(),
});

export type UpdateAddressInput = z.infer<typeof UpdateAddressDto>;
