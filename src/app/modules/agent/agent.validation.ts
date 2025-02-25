import { z } from 'zod';

export const agentValidationSchema = z.object({
  body: z.object({
    agent: z.object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(3, { message: 'Name must be at least 3 characters long' })
        .max(50, { message: 'Name cannot exceed 50 characters' }),

      pin: z.string({ message: 'PIN must be exactly 5 digits' }),

      mobileNumber: z
        .string({ required_error: 'Mobile number is required' })
        .regex(/^\d{11}$/, 'Mobile number must be exactly 11 digits'),
      email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email address' }),

      nid: z.string({ required_error: 'NID is required' }),

      balance: z
        .number({ required_error: 'Balance is required' })
        .min(0, { message: 'Balance cannot be negative' })
        .default(0),

      role: z
        .enum(['agent'], { required_error: 'Role must be agent' })
        .default('agent'),

      isActive: z.boolean().default(true),

      isDeleted: z.boolean().default(false),

      isVerified: z.boolean().default(false),

      totalIncome: z
        .number({ required_error: 'Total income is required' })
        .min(0, { message: 'Total income cannot be negative' })
        .default(0),

      transactions: z.array(z.string()).optional(),
    }),
  }),
});
