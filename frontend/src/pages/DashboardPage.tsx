import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { TodoStats } from '@/components/todo/TodoStats'
import { TodoCard } from '@/components/todo/TodoCard'
import { TodoForm } from '@/components/todo/TodoForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { DashboardStatsSkeleton, TodoCardSkeleton } from '@/components/ui/Skeleton'
import { todoService } from '@/services/todoService'
import type { Todo, CreateTodoInput, UpdateTodoInput, TodoStats as TodoStatsType } from '@/types'

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [stats, setStats] = useState<TodoStatsType>({ total: 0, completed: 0, important: 0, highPriority: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      const data = await todoService.getStats()
      setStats(data)
    } catch {
      // silently fail
    } finally {
      setIsStatsLoading(false)
    }
  }, [])

  const fetchTodos = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await todoService.getAll({ sortBy: 'createdAt', sortOrder: 'desc' })
      setTodos(result.data.slice(0, 5))
    } catch {
      setError('Failed to load todos')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    fetchTodos()
  }, [fetchStats, fetchTodos])

  const handleCreate = async (data: CreateTodoInput | UpdateTodoInput) => {
    setIsSubmitting(true)
    try {
      await todoService.create(data as CreateTodoInput)
      setIsModalOpen(false)
      fetchTodos()
      fetchStats()
    } catch {
      setError('Failed to create todo')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: CreateTodoInput | UpdateTodoInput) => {
    if (!editingTodo) return
    setIsSubmitting(true)
    try {
      await todoService.update(editingTodo.id, data)
      setEditingTodo(null)
      setIsModalOpen(false)
      fetchTodos()
      fetchStats()
    } catch {
      setError('Failed to update todo')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (data: CreateTodoInput | UpdateTodoInput) => {
    if (editingTodo) {
      handleUpdate(data)
    } else {
      handleCreate(data)
    }
  }

  const handleToggleComplete = async (id: string) => {
    try {
      await todoService.toggleComplete(id)
      fetchTodos()
      fetchStats()
    } catch {
      setError('Failed to update todo')
    }
  }

  const handleToggleImportant = async (id: string) => {
    try {
      await todoService.toggleImportant(id)
      fetchTodos()
    } catch {
      setError('Failed to update todo')
    }
  }

  const handleDelete = async (id: string) => {
    setDeleteId(id)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      await todoService.delete(deleteId)
      setDeleteId(null)
      fetchTodos()
      fetchStats()
    } catch {
      setError('Failed to delete todo')
    }
  }

  const openCreateModal = () => {
    setEditingTodo(null)
    setIsModalOpen(true)
  }

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTodo(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Overview of your tasks</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          New Todo
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {isStatsLoading ? <DashboardStatsSkeleton /> : <TodoStats {...stats} />}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Todos</h3>
        </div>
        <div className="p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <TodoCardSkeleton key={i} />)
          ) : todos.length === 0 ? (
            <EmptyState
              icon={<Plus className="w-8 h-8" />}
              title="No todos yet"
              description="Create your first todo to get started"
              action={
                <Button onClick={openCreateModal} size="sm">
                  <Plus className="w-4 h-4" />
                  Create Todo
                </Button>
              }
            />
          ) : (
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggleComplete={handleToggleComplete}
                onToggleImportant={handleToggleImportant}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTodo ? 'Edit Todo' : 'Create Todo'}>
        <TodoForm
          todo={editingTodo}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Todo" size="sm">
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete this todo? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
