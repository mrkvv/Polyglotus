import { InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material';
import './DictionaryPage.scss';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { useState, SyntheticEvent, useRef, useEffect, useCallback } from 'react';
import { WordsTable, WordsFilter, WordRow } from '@widgets/words-table';
import { useGetDictionaryQuery, useGetTranslationsQuery, useInsertWordMutation } from '../api/dictionaryApi';
import type { WordStatus } from '../model/types';
import { mapToWordRow } from '../lib/mapToWordRow';
import { SearchDropdown } from './SearchDropdown';

const filterToStatus: Record<WordsFilter, WordStatus | undefined> = {
  all: undefined,
  learned: 'LEARNED',
  notLearned: 'UNLEARNED',
};

const SEARCH_DEBOUNCE_MS = 400;

export function DictionaryPage() {
  const { t } = useTranslation();

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

  const { data: translationsData, isFetching: isTranslationsFetching } =
    useGetTranslationsQuery(
      { word: debouncedWord },
      { skip: !debouncedWord },
    );

  // ── Добавление слова ──────────────────────────────────
  const [insertWord] = useInsertWordMutation();
  // Храним ключи слов, по которым идёт запрос: "word|ru|partOfSpeech"
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const handleAdd = useCallback(
    async (variant: string, partOfSpeech: string, word: string) => {
      const key = `${word}|${variant}|${partOfSpeech}`;
      setPendingIds((prev) => new Set(prev).add(key));
      try {
        await insertWord({ en: word, ru: variant, partOfSpeech }).unwrap();
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [insertWord],
  );

  const handleManual = useCallback(() => {
    // TODO: открыть модалку ручного добавления
    console.log('manual add');
  }, []);

  const handleClose = useCallback(() => {
    setDropdownOpen(false);
  }, []);

  return (
    <div className="DictionaryPage">
      <div className="DictionaryPage__Header">
        <Typography className="DictionaryPage__Header__Title" variant="h3">
          {t('dictionary')}
        </Typography>

        {/* Обёртка с position: relative — дропдаун позиционируется от неё */}
        <div className="DictionaryPage__SearchWrapper">
          <TextField
            className="DictionaryPage__Search"
            placeholder="Search"
            variant="outlined"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
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
              pendingIds={pendingIds}
              onAdd={handleAdd}
              onManual={handleManual}
              onClose={handleClose}
            />
          )}
        </div>
      </div>

      <div className="DictionaryPage__Content">
        <Typography className="DictionaryPage__Content__Description" variant="h5">
          {t('dictionaryDescription')}
        </Typography>

        <div className="DictionaryPage__TabsBlock">
          <Tabs
            className="DictionaryPage__Tabs"
            value={filter}
            onChange={handleFilterChange}
          >
            <Tab value="all" label="ВСЕ" />
            <Tab value="learned" label="ВЫУЧИЛ" />
            <Tab value="notLearned" label="НЕ ВЫУЧИЛ" />
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
