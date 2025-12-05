import z from 'zod';

export const AddToCartDto = z.object({
  productId: z.string(),
  quantity: z.number().min(1),
});

export type AddToCartInput = z.infer<typeof AddToCartDto>;
