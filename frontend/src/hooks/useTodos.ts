import { useCallback, useEffect, useState } from 'react'
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoFilters } from '@/types'
import { todoService } from '@/services/todoService'

export function useTodos(fetchFn?: () => Promise<{ data: Todo[]; total: number }>) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TodoFilters>({})

  const fetchTodos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (fetchFn) {
        const result = await fetchFn()
        setTodos(result.data)
        setTotal(result.total)
      } else {
        const result = await todoService.getAll(filters)
        setTodos(result.data)
        setTotal(result.total)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch todos'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [fetchFn, filters])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const createTodo = useCallback(async (input: CreateTodoInput) => {
    const newTodo = await todoService.create(input)
    setTodos((prev) => [newTodo, ...prev])
    setTotal((prev) => prev + 1)
    return newTodo
  }, [])

  const updateTodo = useCallback(async (id: string, input: UpdateTodoInput) => {
    const updated = await todoService.update(id, input)
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }, [])

  const deleteTodo = useCallback(async (id: string) => {
    await todoService.delete(id)
    setTodos((prev) => prev.filter((t) => t.id !== id))
    setTotal((prev) => prev - 1)
  }, [])

  const toggleComplete = useCallback(async (id: string) => {
    const updated = await todoService.toggleComplete(id)
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }, [])

  const toggleImportant = useCallback(async (id: string) => {
    const updated = await todoService.toggleImportant(id)
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    return updated
  }, [])

  return {
    todos,
    total,
    isLoading,
    error,
    filters,
    setFilters,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    toggleImportant,
  }
}
