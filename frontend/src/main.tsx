import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n';
import { App } from './app/App'
import './shared/styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
