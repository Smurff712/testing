export const PRIORITY_COLORS = {
  low: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    dot: 'bg-yellow-500',
  },
  high: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
} as const

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
} as const

export const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'All Todos', path: '/todos', icon: 'ListTodo' },
  { label: 'Completed', path: '/todos/completed', icon: 'CheckCircle' },
  { label: 'Important', path: '/todos/important', icon: 'Star' },
  { label: 'Profile', path: '/profile', icon: 'User' },
] as const
