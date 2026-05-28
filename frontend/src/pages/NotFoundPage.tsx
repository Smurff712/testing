import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">Page not found</h2>
        <p className="mt-2 text-gray-500">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="inline-block mt-6">
          <Button>
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
