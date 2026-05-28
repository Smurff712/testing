import { useState, useCallback } from 'react'
import { Plus, ListTodo } from 'lucide-react'
import { TodoCard } from '@/components/todo/TodoCard'
import { TodoForm } from '@/components/todo/TodoForm'
import { TodoFilters } from '@/components/todo/TodoFilters'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { TodoCardSkeleton } from '@/components/ui/Skeleton'
import { useTodos } from '@/hooks/useTodos'
import type { Todo, CreateTodoInput, UpdateTodoInput } from '@/types'

export default function AllTodosPage() {
  const {
    todos, total, isLoading, error, filters, setFilters, fetchTodos,
    createTodo, updateTodo, deleteTodo, toggleComplete, toggleImportant,
  } = useTodos()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CreateTodoInput | UpdateTodoInput) => {
    setIsSubmitting(true)
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, data)
      } else {
        await createTodo(data as CreateTodoInput)
      }
      closeModal()
    } catch {
      // error handled by hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteTodo(deleteId)
      setDeleteId(null)
    } catch {
      // error handled by hook
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

  if (error) {
    return (
      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Todos</h2>
          <p className="text-sm text-gray-500 mt-1">{total} tasks total</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          New Todo
        </Button>
      </div>

      <TodoFilters filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <TodoCardSkeleton key={i} />)
        ) : todos.length === 0 ? (
          <EmptyState
            icon={<ListTodo className="w-8 h-8" />}
            title="No todos found"
            description={filters.search ? 'Try a different search' : 'Create your first todo to get started'}
            action={
              !filters.search ? (
                <Button onClick={openCreateModal} size="sm">
                  <Plus className="w-4 h-4" />
                  Create Todo
                </Button>
              ) : undefined
            }
          />
        ) : (
          todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggleComplete={toggleComplete}
              onToggleImportant={toggleImportant}
              onEdit={openEditModal}
              onDelete={(id) => setDeleteId(id)}
            />
          ))
        )}
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
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  )
}
