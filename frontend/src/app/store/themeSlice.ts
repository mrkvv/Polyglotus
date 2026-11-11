import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: 'light',
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
  },
})

export const { setTheme } = themeSlice.actions
export const themeReducer = themeSlice.reducer
