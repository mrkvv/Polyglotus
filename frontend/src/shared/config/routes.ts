// Константы путей — единственный источник правды для маршрутов

export const ROUTES = {
  HOME:       '/',
  LOGIN:      '/login',
  FIRSTLOGIN: '/login/settings',

  TRAINING_COPY:        '/training/copy',
  TRAINING_COPY_CHECK:  '/training/copy/check',
  TRAINING_COPY_FINAL:  '/training/copy/final',

  TRAINING_SET:         '/training/set',
  TRAINING_SET_FALSE:   '/training/set/false',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
