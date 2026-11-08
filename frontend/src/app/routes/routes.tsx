// app/router/routes.tsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { userStore } from '@entities/user'
import { Sidebar } from '@widgets/sidebar'
import { LoginPage } from '@pages/login-page'
import { HomePage } from '@pages/home-page'
import { AuthCallbackPage } from '@pages/auth-callback-page'

import { 
  OnboardingLayout, 
  Step1Page, 
  Step2Page, 
  Step3Page 
} from '@pages/onboarding';

import "./routes.scss"

function PublicLayout() {
  if (userStore.get()) return <Navigate to="/" replace />
  return <Outlet />
}

function ProtectedLayout() {
  if (!userStore.get()) return <Navigate to="/login" replace />
  return (
    <div className="ProtectedLayout">
      <Sidebar />
      <div className="ProtectedLayout__Content">
        <Outlet />
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: "/auth/callback", element: <AuthCallbackPage /> },
    ],
  },

  // ── Онбординг ───
  {
    element: <OnboardingLayout />,
    children: [
      { path: '/login/step-1', element: <Step1Page /> },
      { path: '/login/step-2', element: <Step2Page /> },
      { path: '/login/step-3', element: <Step3Page /> },
    ],
  },

  {
    element: <ProtectedLayout />,
    children: [
      { path: '/', element: <HomePage /> },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])