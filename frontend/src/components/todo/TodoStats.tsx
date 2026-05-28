import { ListTodo, CheckCircle2, Star, AlertTriangle } from 'lucide-react'

interface TodoStatsProps {
  total: number
  completed: number
  important: number
  highPriority: number
}

export function TodoStats({ total, completed, important, highPriority }: TodoStatsProps) {
  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: ListTodo,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Important',
      value: important,
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: 'High Priority',
      value: highPriority,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 p-5 card-hover"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">{stat.label}</span>
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
