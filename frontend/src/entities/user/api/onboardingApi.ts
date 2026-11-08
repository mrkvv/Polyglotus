import { rtkApi } from '@shared/api/rtkApi';
import { OnboardingPayload } from '../model/types';

export const onboardingApi = rtkApi.injectEndpoints({
  endpoints: (builder) => ({
    completeOnboarding: builder.mutation<void, OnboardingPayload>({
      query: (body) => ({
        url: '/users/me/onboarding',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'], 
    }),
  }),
});

export const { useCompleteOnboardingMutation } = onboardingApi;