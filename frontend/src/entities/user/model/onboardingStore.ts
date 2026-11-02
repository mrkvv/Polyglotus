// Стор онбординга — хранит номер последнего пройденного шага

const ONBOARDING_KEY = 'onboarding_step'

export const onboardingStore = {
  // Вернуть номер последнего пройденного шага (0 = ни один не пройден)
  getCompletedStep(): number {
    return Number(sessionStorage.getItem(ONBOARDING_KEY) ?? 0)
  },

  // Отметить шаг как пройденный (только вперёд, не назад)
  completeStep(step: number): void {
    if (step > this.getCompletedStep()) {
      sessionStorage.setItem(ONBOARDING_KEY, String(step))
    }
  },

  // Проверить, можно ли открыть шаг (шаг 1 всегда доступен, шаг N — если N-1 пройден)
  canAccess(step: number): boolean {
    return step === 1 || this.getCompletedStep() >= step - 1
  },

  // Сбросить при логауте
  clear(): void {
    sessionStorage.removeItem(ONBOARDING_KEY)
  },
}
