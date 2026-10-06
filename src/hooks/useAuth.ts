import { createContext, useContext, useEffect, useState, type ReactNode, createElement } from 'react'
import { getUser, isAuthenticated, logout as logoutUser } from '@/services/authStore'

interface AuthContextType {
  user: { name: string; email: string } | null
  isLoading: boolean
  login: (email: string, name: string, remember?: boolean) => void
  register: (name: string, email: string, remember?: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const u = getUser()
        setUser(u)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = (email: string, name: string, remember = false) => {
    import('@/services/authStore').then(({ login }) => {
      login(email, name, remember)
      const u = getUser()
      setUser(u)
    })
  }

  const register = (name: string, email: string, remember = false) => {
    import('@/services/authStore').then(({ register }) => {
      register(name, email, remember)
      const u = getUser()
      setUser(u)
    })
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  const providerValue: AuthContextType = { user, isLoading, login, register, logout }
  return createElement(AuthContext.Provider, { value: providerValue }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}