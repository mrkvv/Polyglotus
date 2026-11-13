import { WordRow } from '@widgets/words-table';
import type { WordStatus } from '../model/types';
import type { CustomProgressValue } from '@shared/ui/CustomProgress';

export function mapToWordRow(word: {
  id: number;
  en: string;
  ru: string;
  progressCount: 0 | 1 | 2 | 3;
  status: WordStatus;
  addedAt: string;
}): WordRow {
  return {
	id: word.id,
	word: word.en,
	translation: word.ru,
	learned: word.status === 'LEARNED',
	progress: word.progressCount as CustomProgressValue,
	dateAdded: new Date(word.addedAt).toLocaleDateString('ru-RU'),
  };
}