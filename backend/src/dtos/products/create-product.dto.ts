import { z } from 'zod';

export const CreateProductDto = z.object({
  name: z
    .string()
    .min(4)
    .max(60)
    .transform((str) => str.trim()),
  description: z
    .string()
    .min(4)
    .max(100)
    .transform((str) => str.trim()),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num) && num >= 0, 'Invalid price'),
  stock: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num) && num >= 0, 'Invalid stock'),
  category: z
    .string()
    .min(1)
    .transform((str) => str.trim()),
});

export type CreateProductInput = z.infer<typeof CreateProductDto>;
