import { rtkApi } from '@shared/api/rtkApi'; // ваш базовый инстанс
import { 
  GetDictionaryResponse, 
  GetDictionaryRequest,
  GetTranslationsResponse,
  InsertWordRequest,
  InsertWordResponse
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
        params: {
          word,
        },
      }),
      providesTags: ({ word }) => [{ type: 'Dictionary', id: word }],
    }),

    insertWord: builder.mutation<InsertWordResponse, InsertWordRequest>({
      query: (body) => ({
        url: '/dictionary/words',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Dictionary'],
    }),
  }),
});

export const {
  useGetDictionaryQuery,
  useGetTranslationsQuery,
  useInsertWordMutation,
} = dictionaryApi;