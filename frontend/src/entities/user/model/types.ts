export interface OnboardingPayload {
  levelId: number;
  avatarId: number;
  themeIds: number[];
}

export interface UserStreak {
  current: number;
  longest: number;
  lastTrainingDate: string;
}

export interface User {
  id: number;
  yandexId: number;
  firstName: string;
  lastName: string;
  levelId: number;
  avatarId: number;
  topicIds: number[];
  streak: UserStreak;
  createdAt: string;
}