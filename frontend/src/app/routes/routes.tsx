import { createBrowserRouter, redirect, Outlet } from 'react-router-dom'
import { ROUTES } from '@shared/config/routes'
import { userStore } from '@entities/user'
import { Sidebar } from '@widgets/sidebar'
import { LoginPage } from '@pages/login-page'
import { HomePage } from '@pages/home-page'
import styles from './routes.module.scss'

// ─── Лэйаут защищённой зоны (сайд-бар + контент) ────────
function ProtectedLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

// ─── Роутер приложения ───────────────────────────────────
export const router = createBrowserRouter([

  // ── Публичные маршруты ──────────────────────────────────
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
    loader: () => {
      // Уже авторизован — не пускаем на логин
      if (userStore.get()) return redirect(ROUTES.HOME)
      return null
    },
  },

  // ── Защищённые маршруты ─────────────────────────────────
  {
    path: ROUTES.HOME,
    element: <ProtectedLayout />,
    loader: () => {
      // Не авторизован — на страницу логина
      if (!userStore.get()) return redirect(ROUTES.LOGIN)
      return null
    },
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },

  // ── Fallback ────────────────────────────────────────────
  {
    path: '*',
    loader: () => redirect(ROUTES.HOME),
    element: null,
  },
])
