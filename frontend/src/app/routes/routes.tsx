import { createBrowserRouter, Navigate, Outlet, useMatch } from 'react-router-dom'
import { userStore, onboardingStore } from '@entities/user'
import { Sidebar } from '@widgets/sidebar'
import { LoginPage } from '@pages/login-page'
import { HomePage } from '@pages/home-page'
import { AuthCallbackPage } from '@pages/auth-callback-page'
import { Step1Page } from '@pages/step-1-page'
import { Step2Page } from '@pages/step-2-page'
import { Step3Page } from '@pages/step-3-page'
import "./routes.scss"

// ─── Публичный лэйаут: авторизованных отправляем домой ───
function PublicLayout() {
  if (userStore.get()) return <Navigate to="/" replace />
  return <Outlet />
}

// ─── Онбординг-лэйаут: защищает шаги от прямого перехода ─
function OnboardingLayout() {
  // Определяем номер текущего шага из URL (/login/step-N)
  const step1 = useMatch('/login/step-1')
  const step2 = useMatch('/login/step-2')
  const step3 = useMatch('/login/step-3')

  const currentStep = step1 ? 1 : step2 ? 2 : step3 ? 3 : 1

  if (!onboardingStore.canAccess(currentStep)) {
    // Редиректим на последний доступный шаг
    const completed = onboardingStore.getCompletedStep()
    return <Navigate to={`/login/step-${completed + 1}`} replace />
  }

  return <Outlet />
}

// ─── Защищённый лэйаут: неавторизованных на логин ────────
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

// ─── Роутер приложения ───────────────────────────────────
export const router = createBrowserRouter([

  // ── Публичные маршруты ──────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: "/auth/callback", element: <AuthCallbackPage /> },
    ],
  },

  // ── Онбординг (публичный, но с защитой порядка шагов) ───
  {
    element: <OnboardingLayout />,
    children: [
      { path: '/login/step-1', element: <Step1Page /> },
      { path: '/login/step-2', element: <Step2Page /> },
      { path: '/login/step-3', element: <Step3Page /> },
    ],
  },

  // ── Защищённые маршруты ─────────────────────────────────
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/', element: <HomePage /> },
    ],
  },

  // ── Fallback ────────────────────────────────────────────
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
