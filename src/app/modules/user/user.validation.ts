import { z } from 'zod';
const userValidationSchema = z.object({
  body: z.object({
    user: z.object({
      name: z.string().min(1, { message: 'User name is required' }),
      pin: z
        .string()
        .min(4, { message: 'PIN must be at least 4 characters long' }),
      mobileNumber: z
        .string({ message: 'Mobile number is required' })
        .regex(/^\d{11}$/, 'Mobile number must be exactly 11 digits'),
      email: z.string().email({ message: 'Invalid email address' }),
      nid: z
        .string()
        .min(10, { message: 'NID must be at least 10 characters long' }),
      balance: z
        .number()
        .min(0, { message: 'Balance cannot be negative' })
        .default(40),
      role: z.enum(['user']),
      isActive: z.boolean().default(true),
      isDeleted: z.boolean().default(false),
      transactions: z.array(z.string()).optional(),
    }),
  }),
});

// Export schema correctly
export { userValidationSchema };

// Type for TypeScript usage
export type UserValidationType = z.infer<typeof userValidationSchema>;
