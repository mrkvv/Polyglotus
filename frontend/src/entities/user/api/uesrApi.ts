import { rtkApi } from '@shared/api/rtkApi';
import type { User } from '../model/types';

export const userApi = rtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserMe: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'], 
    }),

    updateUserLevel: builder.mutation<number, number>({
      query: (body) => ({
        url: '/users/me/level',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    updateUserAvatar: builder.mutation<number, number>({
      query: (body) => ({
        url: '/users/me/avatar',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    updateUserTopics: builder.mutation<number[], number[]>({
      query: (body) => ({
        url: '/users/me/topics',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetUserMeQuery, 
  useUpdateUserLevelMutation,
  useUpdateUserAvatarMutation,
  useUpdateUserTopicsMutation
} = userApi;