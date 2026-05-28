import { Search, SlidersHorizontal } from 'lucide-react'
import type { Priority, TodoFilters as TodoFiltersType } from '@/types'

interface TodoFiltersProps {
  filters: TodoFiltersType
  onFiltersChange: (filters: TodoFiltersType) => void
}

export function TodoFilters({ filters, onFiltersChange }: TodoFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search todos..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-gray-400" />
        <select
          value={filters.priority || ''}
          onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as Priority | '' })}
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as TodoFiltersType['sortBy'] })}
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
        >
          <option value="createdAt">Newest</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  )
}
