import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem('token');
      
      const publicEndpoints = ['exchangeCode'];

      if (token && !publicEndpoints.includes(endpoint)) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ['User', 'References'],
});