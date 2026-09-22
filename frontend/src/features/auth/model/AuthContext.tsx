import { createContext, useContext, useState, ReactNode } from 'react'
import { userStore } from '@entities/user'

interface AuthContextValue {
  username: string | null
  isAuthenticated: boolean
  login: (username: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => userStore.get())

  const login = (name: string) => {
    userStore.set(name)
    setUsername(name)
  }

  const logout = () => {
    userStore.clear()
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ username, isAuthenticated: username !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
