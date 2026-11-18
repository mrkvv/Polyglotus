import { InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material';
import './DictionaryPage.scss';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { useState, SyntheticEvent, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { WordsTable, WordsFilter, WordRow, MenuAction } from '@widgets/words-table';
import {
  useGetDictionaryQuery,
  useGetTranslationsQuery,
  useInsertWordMutation,
  useUpdateWordStatusMutation,
  useUpdateWordsStatusesMutation,
  useDeleteWordMutation,
  useDeleteWordsBatchMutation,
  useUpdateWordsMutation,
  useLazyGetDictionaryQuery,
  useInsertWordManualyMutation
} from '../api/dictionaryApi';
import { useIncrementWordProgressMutation } from "@entities/vocabulary/api/vocabularyApi";
import type { WordStatus } from '../model/types';
import { mapToWordRow } from '../lib/mapToWordRow';
import { SearchDropdown } from './SearchDropdown';
import { EditWordModal } from './EditWordModal';
import { DeleteWordModal } from './DeleteWordModal';
import { AddWordModal } from './AddWordModal';
import { FlashCardWidget } from './FlashCardWidget';
import { FlashCardModal } from './FlashCardModal';

const filterToStatus: Record<WordsFilter, WordStatus | undefined> = {
  all: undefined,
  learned: 'LEARNED',
  notLearned: 'UNLEARNED',
};

const SEARCH_DEBOUNCE_MS = 400;

export function DictionaryPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Таблица ───────────────────────────────────────────
  const [filter, setFilter] = useState<WordsFilter>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isFetching } = useGetDictionaryQuery({
    page,
    size: pageSize,
    status: filterToStatus[filter],
  });

  const rows: WordRow[] = data?.words.map(mapToWordRow) ?? [];
  const total = data?.totalElements ?? 0;

  const handleFilterChange = (_: SyntheticEvent, newValue: WordsFilter) => {
    setFilter(newValue);
    setPage(0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  // ── Поиск ─────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('');
  const [debouncedWord, setDebouncedWord] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Инициализация из навигации (например, карточка "слово дня" на главной)
  useEffect(() => {
    const word = (location.state as { searchWord?: string } | null)?.searchWord;
    if (word) {
      setSearchInput(word);
      setDebouncedWord(word);
      setDropdownOpen(true);
      // Фокус и позиционирование курсора в конец строки
      requestAnimationFrame(() => {
        const input = searchInputRef.current;
        if (input) {
          input.focus();
          input.setSelectionRange(word.length, word.length);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Дебаунс: обновляем debouncedWord при изменении ввода
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const trimmed = searchInput.trim();
    if (!trimmed) {
      setDebouncedWord('');
      setDropdownOpen(false);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedWord(trimmed);
      setDropdownOpen(true);
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchInput]);

  // Клик вне SearchWrapper — закрыть дропдаун, слово остаётся
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: translationsData, isFetching: isTranslationsFetching, isError: isTranslationsError, refetch: refetchTranslations } =
    useGetTranslationsQuery(
      { word: debouncedWord },
      { skip: !debouncedWord },
    );

  // ── Добавление слова ──────────────────────────────────
  const [insertWord] = useInsertWordMutation();
  const [insertWordManualy] = useInsertWordManualyMutation();
  const [updateWordStatus] = useUpdateWordStatusMutation();
  const [updateWordsStatuses] = useUpdateWordsStatusesMutation();
  const [deleteWord] = useDeleteWordMutation();
  const [deleteWordsBatch] = useDeleteWordsBatchMutation();
  const [updateWord] = useUpdateWordsMutation();
  const [incrementProgress] = useIncrementWordProgressMutation();
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  // ── Флеш-карточки ─────────────────────────────────────
  const [flashOpen, setFlashOpen] = useState(false);
  const [flashWords, setFlashWords] = useState<WordRow[]>([]);
  const [triggerGetUnlearned] = useLazyGetDictionaryQuery();

  const handleFlashOpen = useCallback(async () => {
    const result = await triggerGetUnlearned({ page: 0, size: 20, status: 'UNLEARNED' });
    const words = result.data?.words.map(mapToWordRow) ?? [];
    setFlashWords(words);
    setFlashOpen(true);
  }, [triggerGetUnlearned]);

  const handleFlashFinish = useCallback(
    async (correctIds: number[]) => {
      if (correctIds.length > 0) {
        await incrementProgress({ ids: correctIds });
      }
    },
    [incrementProgress],
  );

  // ── Модалки ───────────────────────────────────────────
  const [editRow, setEditRow] = useState<WordRow | null>(null);
  const [deleteRows, setDeleteRows] = useState<WordRow[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [addInitialWord, setAddInitialWord] = useState('');

  const handleAdd = useCallback(
    async (variant: string, partOfSpeech: string, word: string) => {
      const key = `${word}|${variant}|${partOfSpeech}`;
      setPendingIds((prev) => new Set(prev).add(key));
      try {
        await insertWord({ en: word, ru: variant, partOfSpeech }).unwrap();
        // Обновляем дропдаун — слово должно переехать в раздел "добавленных"
        await refetchTranslations();
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [insertWord, refetchTranslations],
  );

  const handleManual = useCallback(() => {
    setAddInitialWord(searchInput.trim());
    setAddOpen(true);
  }, [searchInput]);

  const handleAddSave = useCallback(
    async (en: string, ru: string, partOfSpeech: string) => {
      await insertWordManualy({ en, ru, partOfSpeech }).unwrap();
    },
    [insertWordManualy],
  );

  // ── Действия контекстного меню ────────────────────────
  const handleMenuAction = useCallback(
    async (action: MenuAction, targetRows: WordRow[]) => {
      const ids = targetRows.map((r) => r.id);
      const isBatch = targetRows.length > 1;

      switch (action) {
        case 'markLearned':
          if (isBatch) {
            await updateWordsStatuses({ status: 'LEARNED', wordIds: ids });
          } else {
            await updateWordStatus({ id: ids[0], status: 'LEARNED' });
          }
          break;
        case 'markUnlearned':
          if (isBatch) {
            await updateWordsStatuses({ status: 'UNLEARNED', wordIds: ids });
          } else {
            await updateWordStatus({ id: ids[0], status: 'UNLEARNED' });
          }
          break;
        case 'delete':
          setDeleteRows(targetRows);
          break;
        case 'edit':
          setEditRow(targetRows[0]);
          break;
      }
    },
    [updateWordStatus, updateWordsStatuses],
  );

  const handleDeleteConfirm = useCallback(
    async (rows: WordRow[]) => {
      if (rows.length === 1) {
        await deleteWord(rows[0].id).unwrap();
      } else {
        await deleteWordsBatch({ wordIds: rows.map((r) => r.id) }).unwrap();
      }
    },
    [deleteWord, deleteWordsBatch],
  );

  const handleEditSave = useCallback(
    async (id: number, en: string, ru: string) => {
      const row = editRow;
      if (!row) return;
      await updateWord({ id, body: { en, ru, partOfSpeech: row.partOfSpeech } }).unwrap();
    },
    [updateWord, editRow],
  );

  // Фокус на поле — если есть текст, показать дропдаун
  const handleFocus = useCallback(() => {
    if (searchInput.trim()) {
      setDebouncedWord(searchInput.trim());
      setDropdownOpen(true);
    }
  }, [searchInput]);

  return (
    <div className="DictionaryPage">
      <div className="DictionaryPage__Header">
        <Typography className="DictionaryPage__Header__Title" variant="h3">
          {t('dictionary')}
        </Typography>

        <div className="DictionaryPage__SearchWrapper" ref={searchWrapperRef}>
          <TextField
            className="DictionaryPage__Search"
            placeholder={t('search_placeholder')}
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={handleFocus}
            autoComplete="off"
            slotProps={{
              htmlInput: { ref: searchInputRef },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          {dropdownOpen && (
            <SearchDropdown
              word={debouncedWord}
              data={translationsData}
              isLoading={isTranslationsFetching}
              isError={isTranslationsError}
              pendingIds={pendingIds}
              onAdd={handleAdd}
              onManual={handleManual}
            />
          )}
        </div>
      </div>

      <div className="DictionaryPage__Content">
        <Typography className="DictionaryPage__Content__Description" variant="h5">
          {t('dictionaryDescription')}
        </Typography>

        <div className="DictionaryPage__ContentRow">
          <div className="DictionaryPage__TabsBlock">
            <Tabs
              className="DictionaryPage__Tabs"
              value={filter}
              onChange={handleFilterChange}
            >
              <Tab value="all" label={t('tab_all')} />
              <Tab value="learned" label={t('tab_learned')} />
              <Tab value="notLearned" label={t('tab_not_learned')} />
            </Tabs>

            <div className="DictionaryPage__TableWrapper">
              <WordsTable
                rows={rows}
                total={total}
                page={page}
                pageSize={pageSize}
                loading={isFetching}
                onPageChange={setPage}
                onPageSizeChange={handlePageSizeChange}
                onMenuAction={handleMenuAction}
              />
            </div>
          </div>
        </div>
      </div>
      <FlashCardWidget
        onClick={handleFlashOpen}
      />
      <EditWordModal
        open={editRow !== null}
        row={editRow}
        onSave={handleEditSave}
        onClose={() => setEditRow(null)}
      />

      <DeleteWordModal
        open={deleteRows.length > 0}
        rows={deleteRows}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteRows([])}
      />

      <AddWordModal
        open={addOpen}
        initialWord={addInitialWord}
        onSave={handleAddSave}
        onClose={() => setAddOpen(false)}
      />

      <FlashCardModal
        open={flashOpen}
        words={flashWords}
        onFinish={handleFlashFinish}
        onClose={() => setFlashOpen(false)}
      />
    </div>
  );
}
