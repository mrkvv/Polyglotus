import { configureStore } from '@reduxjs/toolkit';
import { rtkApi } from '@shared/api/rtkApi';
import { themeReducer } from './themeSlice';

export const store = configureStore({
  reducer: {
    [rtkApi.reducerPath]: rtkApi.reducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;