import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { userStore } from '@entities/user'
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
import { Sidebar } from '@widgets/sidebar'
import { AIChatPage } from '@pages/ai-chat-page'
import { TrainingPage } from '@pages/training-page'
import { DictionaryPage } from '@pages/dictionary-page'
import { SettingsPage } from '@pages/settings-page'

const token = localStorage.getItem('token');

function PublicLayout() {
  if (token) return <Navigate to="/home" replace />
  return <Outlet />
}

function ProtectedLayout() {  
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="ProtectedLayout">
      <Sidebar />
      <div className="ProtectedLayout__Content">
        <Outlet />
      </div>
    </div>
  )
}

function ProtectedLayoutClean() {
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: "/auth/callback", element: <AuthCallbackPage /> },
    ],
  },

  // ── Онбординг (только для залогиненных) ───
  {
    element: <ProtectedLayoutClean />,
    children: [
      {
        element: <OnboardingLayout />,
        children: [
          { path: '/login/step-1', element: <Step1Page /> },
          { path: '/login/step-2', element: <Step2Page /> },
          { path: '/login/step-3', element: <Step3Page /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedLayout />,
    children: [
      { path: '/home', element: <HomePage /> },
      { path: '/chat', element: <AIChatPage /> },
      { path: '/trainings', element: <TrainingPage /> },
      { path: '/dictionary', element: <DictionaryPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])