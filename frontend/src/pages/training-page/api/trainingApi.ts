import { rtkApi } from '@shared/api/rtkApi';
import {
	GetSimpleTrainingResponse,
	GetSimpleTrainingRequest,
	GetPairsTrainingResponse,
	GetFillSentenceTrainingResponse,
} from "../model/types"

export const trainingApi = rtkApi.injectEndpoints({
	endpoints: (builder) => ({
		getSimpleTraining: builder.query<GetSimpleTrainingResponse, GetSimpleTrainingRequest>({
			query: ({ to, amount }) => ({
				url: `/training/translate`,
				method: 'GET',
				params: { to, amount },
			}),
		}),

		getPairsTraining: builder.query<GetPairsTrainingResponse, { amount: number }>({
			query: ({ amount }) => ({
				url: `/training/match`,
				method: 'GET',
				params: { amount },
			}),
		}),

		getFillSentenceTraining: builder.query<GetFillSentenceTrainingResponse, { amount: number }>({
			query: ({ amount }) => ({
				url: `/training/fill`,
				method: 'GET',
				params: { amount },
			}),
		}),
	})
})

export const {
	useGetSimpleTrainingQuery,
	useGetPairsTrainingQuery
} = trainingApi;