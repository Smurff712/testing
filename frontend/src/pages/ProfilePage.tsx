import { useState } from 'react'
import { User, Mail, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    try {
      await updateUser({ name })
      setMessage('Profile updated successfully')
    } catch {
      setMessage('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div className={`p-3 rounded-lg border text-sm ${
              message.includes('successfully')
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <Input
            id="name"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <Input
            id="email"
            label="Email"
            value={email}
            icon={<Mail className="w-4 h-4" />}
            disabled
          />

          <Button type="submit" isLoading={isLoading}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}
