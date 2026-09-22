import { AuthProvider } from '@features/auth'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

// Единое место для всех провайдеров приложения.
// BrowserRouter здесь не нужен — роутинг инициализируется
// через createBrowserRouter + RouterProvider в App.tsx.
export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
