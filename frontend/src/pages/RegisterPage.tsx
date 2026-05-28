import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ListTodo } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import type { ApiErrorResponse } from '@/types'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await register({ name, email, password })
      navigate('/dashboard')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse } }
      setError(axiosErr.response?.data?.error || axiosErr.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
          <ListTodo className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="text-sm text-gray-500 mt-1">Get started with your todo app</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <Input
          id="name"
          label="Name"
          type="text"
          placeholder="Enter your name"
          icon={<User className="w-4 h-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="w-4 h-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Create a password (min 8 chars, uppercase, lowercase, number)"
          icon={<Lock className="w-4 h-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          <UserPlus className="w-4 h-4" />
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
