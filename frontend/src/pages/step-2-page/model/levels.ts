export interface Level {
  value: string
  label: string
  description: string
}

export const LEVELS: Level[] = [
  { value: 'A1', label: 'A1', description: 'Начинаю с нуля' },
  { value: 'A2', label: 'A2', description: 'Знаю основы' },
  { value: 'B1', label: 'B1', description: 'Могу поддержать беседу' },
  { value: 'B2', label: 'B2', description: 'Говорю уверенно' },
  { value: 'C1', label: 'C1', description: 'Свободно владею' },
  { value: 'C2', label: 'C2', description: 'Уровень носителя' },
]
