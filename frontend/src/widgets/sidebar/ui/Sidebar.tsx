import { NavLink } from 'react-router-dom'
import { useAuth } from '@features/auth'
import { ROUTES } from '@shared/config/routes'
import styles from './Sidebar.module.scss'

function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06
        a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09
        A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83
        l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09
        A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83
        l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09
        a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83
        l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09
        a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function Sidebar() {
  const { username } = useAuth()

  return (
    <aside className={styles.sidebar}>
      {/* Шапка */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>P</span>
        </div>
        <span className={styles.appName}>Poliglotus</span>
      </div>

      {/* Навигация */}
      <nav className={styles.nav}>
        <NavLink
          to={ROUTES.HOME}
          className={({ isActive }) =>
            `${styles.navItem}${isActive ? ` ${styles.navItemActive}` : ''}`
          }
        >
          <IconHome />
          <span>Главная</span>
        </NavLink>
      </nav>

      {/* Футер: пользователь + настройки */}
      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.userAvatar}>
            <IconUser />
          </div>
          <span className={styles.username}>{username}</span>
        </div>
        <button className={styles.settingsBtn} title="Настройки" aria-label="Настройки">
          <IconSettings />
        </button>
      </div>
    </aside>
  )
}
