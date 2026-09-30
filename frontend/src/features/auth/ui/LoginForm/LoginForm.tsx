import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../model/AuthContext'
import { ROUTES } from '@shared/config/routes'
import users from '../../data/users.json'
import './LoginForm.scss'

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
    <div className="LoginForm">
      <div className="LoginForm__Logo">
        <span className="LoginForm__Logo__Icon">P</span>
      </div>
      <h1 className="LoginForm__Title">Poliglotus</h1>
      <p className="LoginForm__Subtitle">Войдите в аккаунт</p>

      <form onSubmit={handleSubmit} className="LoginForm__Form">
        <div className="LoginForm__Field">
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

        <div className="LoginForm__Field">
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

        {error && <p className="LoginForm__Error">{error}</p>}

        <button type="submit" className="LoginForm__Submit">
          Войти
        </button>
      </form>
    </div>
  )
}
