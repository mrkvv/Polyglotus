import { InputAdornment, Tab, Tabs, TextField, Typography } from '@mui/material';
import './DictionaryPage.scss';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import { useState, SyntheticEvent } from 'react';
import { WordsTable, WordsFilter } from '@widgets/words-table';

export function DictionaryPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<WordsFilter>('all');

  const handleChange = (_: SyntheticEvent, newValue: WordsFilter) => {
    setFilter(newValue);
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
            onChange={handleChange}
          >
            <Tab value="all" label="ВСЕ" />
            <Tab value="learned" label="ВЫУЧИЛ" />
            <Tab value="notLearned" label="НЕ ВЫУЧИЛ" />
          </Tabs>

          <div className="DictionaryPage__TableWrapper">
            <WordsTable filter={filter} />
          </div>
        </div>
      </div>
    </div>
  );
}
