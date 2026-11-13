export type WordStatus = 'LEARNED' | 'UNLEARNED';

export interface DictionaryWord {
  id: number;
  en: string;
  ru: string;
  partOfSpeech: string;
  /** 0 — не начато, 1–2 — в процессе, 3 — выучено */
  progressCount: 0 | 1 | 2 | 3;
  status: WordStatus;
  addedAt: string;
}

export interface GetDictionaryResponse {
  words: DictionaryWord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetDictionaryRequest {
  page: number;
  size: number;
  /** Если не передать — вернёт все слова без фильтрации по статусу */
  status?: WordStatus;
}
