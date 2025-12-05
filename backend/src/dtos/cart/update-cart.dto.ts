import z from 'zod';

export const UpdateCartDto = z.object({
  quantity: z.number().min(1),
});

export type UpdateCartInput = z.infer<typeof UpdateCartDto>;
