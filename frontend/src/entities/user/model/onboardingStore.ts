const ONBOARDING_KEY = 'onboarding_step'
const AVATAR_KEY = 'onboarding_avatar'
const LEVEL_KEY = 'onboarding_level'
const TOPICS_KEY = 'onboarding_topics'

export const onboardingStore = {
  getCompletedStep(): number {
    return Number(sessionStorage.getItem(ONBOARDING_KEY) ?? 0)
  },

  completeStep(step: number): void {
    if (step > this.getCompletedStep()) {
      sessionStorage.setItem(ONBOARDING_KEY, String(step))
    }
  },

  canAccess(step: number): boolean {
    return step === 1 || this.getCompletedStep() >= step - 1
  },


  // Шаг 1: Аватар
  setAvatarId(id: number) {
    sessionStorage.setItem(AVATAR_KEY, String(id))
  },
  getAvatarId(): number | null {
    const id = sessionStorage.getItem(AVATAR_KEY)
    return id ? Number(id) : null
  },

  // Шаг 2: Уровень
  setLevelId(id: number) {
    sessionStorage.setItem(LEVEL_KEY, String(id))
  },
  getLevelId(): number | null {
    const id = sessionStorage.getItem(LEVEL_KEY)
    return id ? Number(id) : null
  },

  // Шаг 3: Темы (массив чисел)
  setTopicIds(ids: number[]) {
    sessionStorage.setItem(TOPICS_KEY, JSON.stringify(ids))
  },
  getTopicIds(): number[] {
    const ids = sessionStorage.getItem(TOPICS_KEY)
    return ids ? JSON.parse(ids) : []
  },

  // Сброс при логауте
  clear(): void {
    sessionStorage.removeItem(ONBOARDING_KEY)
    sessionStorage.removeItem(AVATAR_KEY)
    sessionStorage.removeItem(LEVEL_KEY)
    sessionStorage.removeItem(TOPICS_KEY)
  },
}
