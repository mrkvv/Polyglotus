import { rtkApi } from '@shared/api/rtkApi';
import type { GetDailyWordResponce, GetPhraseResponce, ReferenceResponse } from '../model/types';

export const referenceApi = rtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferences: builder.query<ReferenceResponse, void>({
      query: () => ({
        url: '/references',
        method: 'GET'
      }), 
      providesTags: ['References'], 
    }),

    getPhrase: builder.query<GetPhraseResponce, void>({
      query: () => ({
        url: '/phrase',
        method: 'GET'
      })
    }),

    getDailyWord: builder.query<GetDailyWordResponce, void>({
      query: () => ({
        url: '/daily-word',
        method: 'GET'
      })
    })
  }),
});

export const {
  useGetReferencesQuery,
  useGetPhraseQuery,
  useGetDailyWordQuery
} = referenceApi;