import { rtkApi } from '@shared/api/rtkApi';
import { 
  GetDictionaryResponse, 
  GetDictionaryRequest,
  GetTranslationsResponse,
  InsertWordRequest,
  InsertWordResponse,
  WordStatus,
  UpdateWordPayload
} from '../model/types';

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

    getTranslations: builder.query<GetTranslationsResponse, { word: string }>({
      query: ({ word }) => ({
        url: '/translations',
        method: 'GET',
        params: { word },
      }),
    }),

    insertWord: builder.mutation<InsertWordResponse, InsertWordRequest>({
      query: (body) => ({
        url: '/dictionary/words',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Dictionary'],
    }),

    updateWordStatus: builder.mutation<InsertWordResponse, { id: number, status: WordStatus }>({
      query: ({ id, status }) => ({
        url: `/dictionary/words/status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Dictionary'],
    }),

    updateWordsStatuses: builder.mutation<InsertWordResponse, { status: WordStatus, wordIds: number[] }>({
      query: ({ status, wordIds }) => ({
        url: '/dictionary/words/status',
        method: 'PATCH',
        body: { status, wordIds },
      }),
      invalidatesTags: ['Dictionary'],
    }),

    updateWords: builder.mutation<InsertWordResponse, UpdateWordPayload>({
      query: ({id, body}) => ({
        url: `/dictionary/words/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Dictionary'],
    }),

    deleteWord: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dictionary/words/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dictionary'],
    }),
    
    deleteWordsBatch: builder.mutation<void, { wordIds: number[] }>({
      query: (body) => ({
        url: `/dictionary/words`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Dictionary'],
    }),

    incrementWordProgress: builder.mutation<void, { ids: number[] }>({
      query: (body) => ({
        url: `/training/mark-correct`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetDictionaryQuery,
  useLazyGetDictionaryQuery,
  useGetTranslationsQuery,
  useInsertWordMutation,
  useUpdateWordStatusMutation,
  useUpdateWordsStatusesMutation,
  useUpdateWordsMutation,
  useDeleteWordMutation,
  useDeleteWordsBatchMutation,
  useIncrementWordProgressMutation,
} = dictionaryApi;