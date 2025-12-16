import { z } from 'zod';

export const UpdateProductDto = z.object({
  name: z.string().min(4).max(60).trim().optional(),
  description: z.string().min(10).max(700).trim().optional(),
  price: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num) && num >= 0, 'Invalid price')
    .optional(),
  stock: z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((num) => !isNaN(num) && num >= 0, 'Invalid stock')
    .optional(),
  category: z.string().min(1).trim().optional(),
});

export type UpdateProductInput = z.infer<typeof UpdateProductDto>;
