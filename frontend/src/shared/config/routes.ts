// Константы путей — единственный источник правды для маршрутов

export const ROUTES = {
  HOME:  '/',
  LOGIN: '/login',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
