import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../model/AuthContext'
import { ROUTES } from '@shared/config/routes'
import users from '../../data/users.json'
import styles from './LoginForm.module.scss'

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = users.find(
      (u) => u.username === username && u.password === password,
    )
    if (found) {
      login(found.username)
      navigate(ROUTES.HOME)
    } else {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>P</span>
      </div>
      <h1 className={styles.title}>Poliglotus</h1>
      <p className={styles.subtitle}>Войдите в аккаунт</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="username">Логин</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите логин"
            autoComplete="username"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submit}>
          Войти
        </button>
      </form>
    </div>
  )
}
