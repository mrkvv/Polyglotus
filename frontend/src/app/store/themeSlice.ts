import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { userApi } from '@entities/user/api/uesrApi'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: 'light',
}

function themeIdToTheme(id: number): Theme {
  return id === 1 ? 'light' : 'dark'
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getUserMe.matchFulfilled,
      (state, action) => {
        state.theme = themeIdToTheme(action.payload.themeId)
      }
    )
  },
})

export const { setTheme } = themeSlice.actions
export const themeReducer = themeSlice.reducer
