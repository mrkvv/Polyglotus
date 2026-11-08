import { rtkApi } from '@shared/api/rtkApi';
import type { ReferenceResponse } from '../model/types';

export const referenceApi = rtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getReferences: builder.query<ReferenceResponse, void>({
      query: () => '/references',
      providesTags: ['References'], 
    }),
  }),
});

export const { useGetReferencesQuery } = referenceApi;