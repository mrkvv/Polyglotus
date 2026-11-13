import { rtkApi } from '@shared/api/rtkApi';
import type { GetDictionaryRequest, GetDictionaryResponse } from '../model/types';

export const dictionaryApi = rtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getDictionary: builder.query<GetDictionaryResponse, GetDictionaryRequest>({
      query: ({ page, size, status }) => ({
        url: '/dictionary',
        method: 'GET',
        params: {
          page,
          size,
          ...(status !== undefined && { status }),
        },
      }),
      providesTags: ['Dictionary'],
    }),
  }),
});

export const { useGetDictionaryQuery } = dictionaryApi;
