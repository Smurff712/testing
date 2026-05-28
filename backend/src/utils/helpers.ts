import { Priority } from '@prisma/client';

export const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  password?: string;
}) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

export const parsePagination = (query: {
  page?: string | number;
  limit?: string | number;
}): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const parseSortOrder = (sortOrder?: string): 'asc' | 'desc' => {
  if (sortOrder === 'asc' || sortOrder === 'desc') return sortOrder;
  return 'desc';
};

export const isValidPriority = (value: string): value is Priority => {
  return Object.values(Priority).includes(value as Priority);
};
