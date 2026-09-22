import { LoginForm } from '@features/auth'
import styles from './LoginPage.module.scss'

export function LoginPage() {
  return (
    <div className={styles.page}>
      <LoginForm />
    </div>
  )
}
