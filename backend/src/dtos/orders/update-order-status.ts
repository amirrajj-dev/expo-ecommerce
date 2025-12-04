import z from 'zod';

export const UpdateOrderStatusDto = z.object({
  status: z.enum(['pending', 'shipped', 'delivered']),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusDto>;
