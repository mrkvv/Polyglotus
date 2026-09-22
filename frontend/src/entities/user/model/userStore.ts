// Хранилище пользователя — минимальная модель для работы с сессией

const SESSION_KEY = 'username'

export const userStore = {
  get(): string | null {
    return sessionStorage.getItem(SESSION_KEY)
  },
  set(username: string): void {
    sessionStorage.setItem(SESSION_KEY, username)
  },
  clear(): void {
    sessionStorage.removeItem(SESSION_KEY)
  },
}
