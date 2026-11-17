import { rtkApi } from '@shared/api/rtkApi';
import { getMessageHistoryResponse, sendMessageResponse } from '../model/types';

export const aiChatApi = rtkApi.injectEndpoints({
	endpoints: (builder) => ({
		sendMessage: builder.mutation<sendMessageResponse, { content: string }>({
			query: (body) => ({
				url: `/ai/chat`,
				method: 'POST',
				body,
			}),
			invalidatesTags: ['ChatHistory'],
		}),

		getMessageHistory: builder.query<getMessageHistoryResponse, void>({
			query: () => ({
				url: `/ai/chat`,
				method: 'GET',
			}),
			providesTags: ['ChatHistory'],
		}),

		getHelloMessage: builder.query<{ helloMessage: string }, void>({
			query: () => ({
				url: `/ai/chat/hello`,
				method: 'GET',
			}),
		}),

		deleteChat: builder.mutation<void, void>({
			query: () => ({
				url: `/ai/chat`,
				method: 'DELETE',
			}),
			invalidatesTags: ['ChatHistory'],
		}),
	})
})

export const {
	useSendMessageMutation,
	useGetMessageHistoryQuery,
	useGetHelloMessageQuery,
	useDeleteChatMutation
} = aiChatApi;