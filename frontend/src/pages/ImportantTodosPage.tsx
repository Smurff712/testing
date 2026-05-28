import { useState, useEffect, useCallback } from 'react'
import { Star, Plus } from 'lucide-react'
import { TodoCard } from '@/components/todo/TodoCard'
import { TodoForm } from '@/components/todo/TodoForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { TodoCardSkeleton } from '@/components/ui/Skeleton'
import { todoService } from '@/services/todoService'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types'

export default function ImportantTodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchTodos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await todoService.getAll({ sortBy: 'createdAt', sortOrder: 'desc' })
      setTodos(result.data.filter((t) => t.important))
    } catch {
      setError('Failed to load important todos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchTodos() }, [fetchTodos])

  const handleToggleComplete = async (id: string) => {
    try {
      await todoService.toggleComplete(id)
      fetchTodos()
    } catch { setError('Failed to update todo') }
  }

  const handleToggleImportant = async (id: string) => {
    try {
      await todoService.toggleImportant(id)
      fetchTodos()
    } catch { setError('Failed to update todo') }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await todoService.delete(deleteId)
      setDeleteId(null)
      fetchTodos()
    } catch { setError('Failed to delete todo') }
  }

  const handleSubmit = async (data: CreateTodoInput | UpdateTodoInput) => {
    try {
      if (editingTodo) {
        await todoService.update(editingTodo.id, data)
      } else {
        await todoService.create(data as CreateTodoInput)
      }
      setIsModalOpen(false)
      setEditingTodo(null)
      fetchTodos()
    } catch { setError('Failed to save todo') }
  }

  if (error) {
    return <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Important</h2>
          <p className="text-sm text-gray-500 mt-1">{todos.length} important tasks</p>
        </div>
        <Button onClick={() => { setEditingTodo(null); setIsModalOpen(true) }}>
          <Plus className="w-4 h-4" /> New Todo
        </Button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <TodoCardSkeleton key={i} />)
        ) : todos.length === 0 ? (
          <EmptyState
            icon={<Star className="w-8 h-8" />}
            title="No important tasks"
            description="Mark tasks as important to see them here"
          />
        ) : (
          todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggleComplete={handleToggleComplete}
              onToggleImportant={handleToggleImportant}
              onEdit={(t) => { setEditingTodo(t); setIsModalOpen(true) }}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTodo(null) }} title={editingTodo ? 'Edit Todo' : 'Create Todo'}>
        <TodoForm todo={editingTodo} onSubmit={handleSubmit} onCancel={() => { setIsModalOpen(false); setEditingTodo(null) }} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Todo" size="sm">
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this todo?</p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
