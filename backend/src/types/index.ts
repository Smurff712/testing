import { Request } from 'express';
import { Priority } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  important?: boolean;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  important?: boolean;
  priority?: Priority;
  completed?: boolean;
  dueDate?: string | null;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
}

export interface TodoQueryParams {
  page?: number;
  limit?: number;
  completed?: boolean;
  important?: boolean;
  priority?: Priority;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}
