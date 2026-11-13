import { rtkApi } from '@shared/api/rtkApi'
import type { AuthResponse } from '../model/types'

const BASE_URL = 'http://localhost:8000'

export function redirectToYandexLogin() {
  window.location.href = `${BASE_URL}/auth/yandex`
}

export const authApi = rtkApi.injectEndpoints({
    endpoints: (builder) => ({
        exchangeCode: builder.mutation<
            AuthResponse,
            { code: string }
        >({
            query: (body) => ({
                url: '/auth/yandex',
                method: 'POST',
                body,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const { 
    useExchangeCodeMutation,
    useLogoutMutation
} = authApi;