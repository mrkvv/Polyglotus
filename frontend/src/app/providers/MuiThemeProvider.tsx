import { useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useSelector } from 'react-redux'
import type { RootState } from '@app/store/store'
import type { ReactNode } from 'react'

interface MuiThemeProviderProps {
  children: ReactNode
}

export function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  const theme = useSelector((state: RootState) => state.theme.theme)

  const selectedBg = theme === 'light' ? '#E5F0D0' : '#44944A'

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          ...(theme === 'light'
            ? {
                background: {
                  default: '#ffffff',
                },
                text: {
                  primary: '#000000',
                },
              }
            : {
                background: {
                  default: '#2a2a2a',
                },
                text: {
                  primary: '#ffffff',
                },
              }),
        },
        components: {
          MuiListItemButton: {
            styleOverrides: {
              root: {
                '&.Mui-selected': {
                  backgroundColor: selectedBg,
                  '&:hover': {
                    backgroundColor: selectedBg,
                  },
                },
              },
            },
          },
        },
      }),
    [theme, selectedBg],
  )

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
