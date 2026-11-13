import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Providers } from './providers'
import { MuiThemeProvider } from './providers/MuiThemeProvider'
import { router } from './routes/routes'
import type { RootState } from './store/store'

function ThemedApp() {
  const theme = useSelector((state: RootState) => state.theme.theme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <MuiThemeProvider>
      <RouterProvider router={router} />
    </MuiThemeProvider>
  )
}

export function App() {
  return (
    <Providers>
      <ThemedApp />
    </Providers>
  )
}
