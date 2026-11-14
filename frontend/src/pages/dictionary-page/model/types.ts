export type WordStatus = 'LEARNED' | 'UNLEARNED';

export interface DictionaryWord {
  id: number;
  en: string;
  ru: string;
  partOfSpeech: string;
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
  status?: WordStatus;
}

export interface UserDictionaryItem {
  id: number;
  ru: string;
  partOfSpeech: string;
}

export interface CatalogTranslationItem {
  title: string;
  definition: string;
  part_of_speech: string;
  variants_of_words: string[];
}

export interface GetTranslationsResponse {
  word: string;
  inUserDictionary: UserDictionaryItem[];
  inCatalog: CatalogTranslationItem[];
}

export interface InsertWordRequest {
  en: string;
  ru: string;
  partOfSpeech: string;
}

export interface InsertWordResponse {
  id: number;
  en: string;
  ru: string;
  partOfSpeech: string;
  progressCount: 0 | 1 | 2 | 3;
  status: WordStatus;
  addedAt: string;
}

export interface UpdateWordPayload{
  id: number;
  body: InsertWordRequest;
}
