import api from '@/api/axios'
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilters, PaginatedResponse, TodoStats } from '@/types'

function toUpperCasePriority(input: { priority?: string }): void {
  if (input.priority) {
    (input as Record<string, unknown>).priority = input.priority.toUpperCase()
  }
}

function buildQueryString(filters?: TodoFilters): string {
  if (!filters) return ''
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.priority) params.set('priority', filters.priority.toUpperCase())
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export const todoService = {
  async getAll(filters?: TodoFilters): Promise<PaginatedResponse<Todo>> {
    const { data } = await api.get<PaginatedResponse<Todo>>(`/todos${buildQueryString(filters)}`)
    return data
  },

  async getById(id: string): Promise<Todo> {
    const { data } = await api.get<Todo>(`/todos/${id}`)
    return data
  },

  async create(input: CreateTodoInput): Promise<Todo> {
    toUpperCasePriority(input)
    const { data } = await api.post<Todo>('/todos', input)
    return data
  },

  async update(id: string, input: UpdateTodoInput): Promise<Todo> {
    toUpperCasePriority(input)
    const { data } = await api.put<Todo>(`/todos/${id}`, input)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/todos/${id}`)
  },

  async toggleComplete(id: string): Promise<Todo> {
    const { data } = await api.patch<Todo>(`/todos/${id}/toggle`)
    return data
  },

  async toggleImportant(id: string): Promise<Todo> {
    const { data } = await api.patch<Todo>(`/todos/${id}/toggle-important`)
    return data
  },

  async getStats(): Promise<TodoStats> {
    const { data } = await api.get<TodoStats>('/todos/stats')
    return data
  },
}
