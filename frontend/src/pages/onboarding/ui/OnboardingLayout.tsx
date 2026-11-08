// pages/onboarding/ui/OnboardingLayout.tsx
import { Navigate, Outlet, useMatch } from 'react-router-dom';
import { onboardingStore } from '@entities/user';
import { useGetReferencesQuery } from '@entities/reference';
import { Box, CircularProgress } from '@mui/material';

export const OnboardingLayout = () => {
  const { data, isLoading, isError } = useGetReferencesQuery();

  const step1 = useMatch('/login/step-1');
  const step2 = useMatch('/login/step-2');
  const step3 = useMatch('/login/step-3');
  const currentStep = step1 ? 1 : step2 ? 2 : step3 ? 3 : 1;

  if (!onboardingStore.canAccess(currentStep)) {
    const completed = onboardingStore.getCompletedStep();
    return <Navigate to={`/login/step-${completed + 1}`} replace />;
  }

  if (isLoading) {
    return (
      <Box 
      sx={{
        display: "flex",
        justifyContent: "center",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return <div>Ошибка загрузки данных</div>;
  }

  return (
    <Outlet 
      context={{ 
        avatars: data.avatars, 
        levels: data.levels, 
        topics: data.topics 
      }} 
    />
  );
};