import z from 'zod';

export const CreateReviewDto = z.object({
  productId: z.string(),
  orderId: z.string(),
  rating: z.number().min(1).max(5),
});

export type CreateReviewInput = z.infer<typeof CreateReviewDto>;
