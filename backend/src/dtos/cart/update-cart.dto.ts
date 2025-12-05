import z from 'zod';

export const UpdateCartDto = z.object({
  quantity: z.number().int(),
});

export type UpdateCartInput = z.infer<typeof UpdateCartDto>;
