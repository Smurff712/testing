import { useState, useEffect } from 'react'
import type { Todo, CreateTodoInput, UpdateTodoInput, Priority } from '@/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface TodoFormProps {
  todo?: Todo | null
  onSubmit: (data: CreateTodoInput | UpdateTodoInput) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TodoForm({ todo, onSubmit, onCancel, isLoading }: TodoFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (todo) {
      setTitle(todo.title)
      setDescription(todo.description || '')
      setPriority(todo.priority)
      setDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '')
    }
  }, [todo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setError('')
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        id="title"
        placeholder="Enter todo title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={error}
      />

      <div className="space-y-1.5">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Enter description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Input
          label="Due Date"
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {todo ? 'Update Todo' : 'Create Todo'}
        </Button>
      </div>
    </form>
  )
}
