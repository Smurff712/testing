export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  _count?: { todos: number }
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export type Priority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  important: boolean
  priority: Priority
  dueDate?: string
  userId: string
  user?: { id: string; name: string; email: string }
  createdAt: string
  updatedAt: string
}

export interface CreateTodoInput {
  title: string
  description?: string
  important?: boolean
  priority?: Priority
  dueDate?: string
}

export interface UpdateTodoInput {
  title?: string
  description?: string
  completed?: boolean
  important?: boolean
  priority?: Priority
  dueDate?: string
}

export interface TodoFilters {
  search?: string
  priority?: Priority | ''
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface TodoStats {
  total: number
  completed: number
  important: number
  highPriority: number
}

export interface ApiErrorResponse {
  success: boolean
  error?: string
  message?: string
}
