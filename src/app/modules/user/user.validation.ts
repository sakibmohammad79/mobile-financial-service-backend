import { z } from 'zod';

// Define User Validation Schema
const userValidationSchema = z.object({
  body: z.object({
    user: z.object({
      name: z.string().min(1, { message: 'User name is required' }),
      pin: z
        .string()
        .min(4, { message: 'PIN must be at least 4 characters long' }), // Should be hashed before storing
      mobileNumber: z.string({ message: 'Mobile number is required' }),
      // .regex(/^(\+8801[3-9]\d{8})$/, {
      //   message: 'Invalid Bangladeshi mobile number',
      // }),
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
      transactions: z.array(z.string()).optional(), // Array of transaction ObjectIds
    }),
  }),
});

// Export schema correctly
export { userValidationSchema };

// Type for TypeScript usage
export type UserValidationType = z.infer<typeof userValidationSchema>;
