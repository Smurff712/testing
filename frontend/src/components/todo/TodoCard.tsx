import { Trash2, Edit3, Star, Calendar } from 'lucide-react'
import type { Todo } from '@/types'
import { cn } from '@/utils/cn'
import { Badge } from '@/components/ui/Badge'
import { PRIORITY_LABELS } from '@/utils/constants'

interface TodoCardProps {
  todo: Todo
  onToggleComplete: (id: string) => void
  onToggleImportant: (id: string) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TodoCard({ todo, onToggleComplete, onToggleImportant, onEdit, onDelete }: TodoCardProps) {
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null
  const isOverdue = dueDate && dueDate < new Date() && !todo.completed

  return (
    <div
      className={cn(
        'group bg-white rounded-xl border border-gray-200 p-4 card-hover',
        todo.completed && 'opacity-75'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
            todo.completed
              ? 'bg-primary-600 border-primary-600 text-white'
              : 'border-gray-300 hover:border-primary-400'
          )}
        >
          {todo.completed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className={cn(
                  'text-sm font-medium text-gray-900',
                  todo.completed && 'line-through text-gray-400'
                )}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={cn(
                    'mt-1 text-sm text-gray-500 line-clamp-2',
                    todo.completed && 'line-through text-gray-400'
                  )}
                >
                  {todo.description}
                </p>
              )}
            </div>
            <Badge variant={todo.priority}>{PRIORITY_LABELS[todo.priority]}</Badge>
          </div>

          <div className="mt-3 flex items-center gap-4">
            {dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs',
                  isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {isOverdue && ' (Overdue)'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleImportant(todo.id)}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              todo.important
                ? 'text-yellow-500 hover:bg-yellow-50'
                : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'
            )}
          >
            <Star className={cn('w-4 h-4', todo.important && 'fill-current')} />
          </button>
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
