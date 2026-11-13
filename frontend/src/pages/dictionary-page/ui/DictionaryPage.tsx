import { InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material';
import './DictionaryPage.scss';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { useState, SyntheticEvent } from 'react';
import { WordsTable, WordsFilter, WordRow } from '@widgets/words-table';
import { useGetDictionaryQuery } from '../api/dictionaryApi';
import type { WordStatus } from '../model/types';
import type { CustomProgressValue } from '@shared/ui/CustomProgress';

// Маппинг фильтра таба → статус для API
const filterToStatus: Record<WordsFilter, WordStatus | undefined> = {
  all: undefined,
  learned: 'LEARNED',
  notLearned: 'UNLEARNED',
};

// Маппинг DictionaryWord → WordRow для таблицы
function mapToWordRow(word: {
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

export function DictionaryPage() {
  const { t } = useTranslation();

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

  return (
    <div className="DictionaryPage">
      <div className="DictionaryPage__Header">
        <Typography className="DictionaryPage__Header__Title" variant="h3">
          {t('dictionary')}
        </Typography>
        <TextField
          className="DictionaryPage__Search"
          placeholder="Search"
          variant="outlined"
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
