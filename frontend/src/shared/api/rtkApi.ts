import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { UNAUTHORIZED_EVENT } from '@app/providers/ErrorHandlerProvider';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000',
  prepareHeaders: (headers, { endpoint }) => {
    const token = localStorage.getItem('token');

    const publicEndpoints = ['exchangeCode'];

    if (token && !publicEndpoints.includes(endpoint)) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithUnauthorized: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const data = result.error.data as { error?: string } | undefined;
    if (data?.error === 'UNAUTHORIZED') {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
  }

  return result;
};

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithUnauthorized,
  endpoints: () => ({}),
  tagTypes: ['User', 'References', 'Dictionary'],
});