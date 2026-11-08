import { useOutletContext } from 'react-router-dom';
import type { AvatarItem, ReferenceItem } from '@entities/reference';

interface OnboardingContextType {
  avatars: AvatarItem[];
  levels: ReferenceItem[];
  topics: ReferenceItem[];
}

export const useOnboardingContext = () => {
  return useOutletContext<OnboardingContextType>();
};