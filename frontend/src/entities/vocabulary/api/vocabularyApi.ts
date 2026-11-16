import { rtkApi } from '@shared/api/rtkApi';

export const vocabularyApi = rtkApi.injectEndpoints({
	endpoints: (builder) => ({
		incrementWordProgress: builder.mutation<void, { ids: number[] }>({
			query: (body) => ({
				url: `/training/mark-correct`,
				method: 'POST',
				body,
			}),
		}),
	})
})

export const {
	useIncrementWordProgressMutation
} = vocabularyApi;