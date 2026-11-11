import { rtkApi } from '@shared/api/rtkApi'
import { AuthResponse } from './model/types'

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