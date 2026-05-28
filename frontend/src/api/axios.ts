import axios from 'axios'

const api = axios.create({
  baseURL: 'https://todo-backend-y67z.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase()
}

function transformResponseData(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(transformResponseData)
  }
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'priority' && typeof value === 'string') {
        result[key] = toCamelCase(value)
      } else if (key === 'created_at' || key === 'updated_at') {
        result[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = value
      } else if (typeof value === 'object' && value !== null) {
        result[key] = transformResponseData(value)
      } else {
        result[key] = value
      }
    }
    return result
  }
  return obj
}

api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      const res = response.data as { success: boolean; data?: unknown; meta?: { page: number; limit: number; total: number; totalPages: number }; error?: string }

      if (!res.success) {
        return Promise.reject(new Error(res.error || 'Request failed'))
      }

      if (res.meta) {
        response.data = {
          data: transformResponseData(res.data) as [],
          total: res.meta.total,
          page: res.meta.page,
          limit: res.meta.limit,
          totalPages: res.meta.totalPages,
        }
      } else {
        response.data = transformResponseData(res.data)
      }
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
