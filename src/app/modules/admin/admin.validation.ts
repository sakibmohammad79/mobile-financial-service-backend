import { z } from 'zod';

export const adminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(3, 'Name must be at least 3 characters long'),
      pin: z.string({ message: 'PIN must be exactly 5 digits' }),
      mobileNumber: z
        .string({ required_error: 'Mobile number is required' })
        .regex(/^\d{11}$/, 'Mobile number must be exactly 11 digits'),
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format'),
      nid: z
        .string({ required_error: 'NID is required' })
        .min(10, 'NID must be at least 10 characters long'),
      balance: z
        .number()
        .min(0, { message: 'Balance cannot be negative' })
        .default(0),
      role: z.enum(['admin'], { required_error: 'Role must be "admin"' }),
      isActive: z.boolean().default(true),
      isDeleted: z.boolean().default(false),
      totalSystemBalance: z
        .number({ required_error: 'Total system balance is required' })
        .nonnegative('Total balance cannot be negative'),
      totalIncome: z
        .number({ required_error: 'Total income is required' })
        .nonnegative('Total income cannot be negative'),
    }),
  }),
});
