import { z } from 'zod';
import { Priority } from '@prisma/client';

const dateOrDatetime = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')
  .transform((val) => new Date(val).toISOString());

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional(),
  important: z.boolean().optional(),
  priority: z
    .preprocess((val) => typeof val === 'string' ? val.toUpperCase() : val, z.nativeEnum(Priority))
    .optional()
    .default(Priority.MEDIUM),
  dueDate: dateOrDatetime.optional().nullable(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional()
    .nullable(),
  completed: z.boolean().optional(),
  important: z.boolean().optional(),
  priority: z.preprocess((val) => typeof val === 'string' ? val.toUpperCase() : val, z.nativeEnum(Priority)).optional(),
  dueDate: dateOrDatetime.optional().nullable(),
});

export const todoQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  completed: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  important: z
    .string()
    .optional()
    .transform((val) => (val === 'true' ? true : val === 'false' ? false : undefined)),
  priority: z.nativeEnum(Priority).optional(),
  search: z.string().trim().optional(),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;
