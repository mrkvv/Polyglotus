import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './i18n';
import { App } from './app/App'
import { store } from './app/store/store'
import './shared/styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store = {store}>
      <App />
    </Provider>
  </StrictMode>,
)
