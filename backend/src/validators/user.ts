import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters')
    .trim()
    .toLowerCase()
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
