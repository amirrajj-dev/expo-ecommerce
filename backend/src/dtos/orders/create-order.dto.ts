import z from 'zod';

export const CreateOrderDto = z.object({
  items: z
    .array(
      z.object({
        product: z.string().trim().min(1, 'product id is required'),
        price: z.number().min(0),
        quantity: z.number().int().min(1),
        image: z.string().url().min(1),
        name: z
          .string()
          .min(4)
          .transform((str) => str.trim()),
      }),
    )
    .min(1, 'at least one order item is required'),
  shippingAddress: z.object({
    fullName: z.string().trim().min(1),
    streetAddress: z.string().trim().min(1),
    city: z.string().trim().min(1),
    state: z.string().trim().min(1),
    zipCode: z.string().trim().min(1),
    phoneNumber: z
      .string()
      .trim()
      .min(8)
      .regex(/^[0-9+\-() ]+$/, 'invalid phone number format'),
  }),
  paymentResult: z.object({
    id: z.string().trim().min(1),
    status: z.enum(['succeeded', 'failed', 'pending']),
  }),
  totalPrice: z.number().min(0),
});

export type CreateOrderInput = z.infer<typeof CreateOrderDto>;
