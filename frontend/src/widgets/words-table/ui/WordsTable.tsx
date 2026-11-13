import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, CircularProgress, Checkbox, IconButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { CustomProgress, CustomProgressValue } from '@shared/ui/CustomProgress';
import './WordsTable.scss';

export type WordsFilter = 'all' | 'learned' | 'notLearned';

export interface WordRow {
  id: number;
  word: string;
  translation: string;
  learned: boolean;
  progress: CustomProgressValue;
  dateAdded: string;
}

interface WordsTableProps {
  filter: WordsFilter;
}

// Заглушка запроса
async function fetchWords(filter: WordsFilter, page: number, pageSize: number) {
  await new Promise((r) => setTimeout(r, 300));

  const PROGRESS: CustomProgressValue[] = [0, 1, 2, 3];

  const all: WordRow[] = Array.from({ length: 47 }).map((_, i) => ({
    id: i + 1,
    word: 'Cucumber',
    translation: 'Огурец',
    learned: i === 5,
    progress: i < PROGRESS.length ? PROGRESS[i] : 0 as CustomProgressValue,
    dateAdded: '01.01.2011',
  }));

  const filtered = all.filter((w) => {
    if (filter === 'learned') return w.learned;
    if (filter === 'notLearned') return !w.learned;
    return true;
  });

  return {
    rows: filtered.slice(page * pageSize, page * pageSize + pageSize),
    total: filtered.length,
  };
}

export function WordsTable({ filter }: WordsTableProps) {
  const [rows, setRows] = useState<WordRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    setPage(0);
    setSelected([]);
  }, [filter]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchWords(filter, page, pageSize)
      .then((res) => {
        if (!cancelled) {
          setRows(res.rows);
          setTotal(res.total);
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [filter, page, pageSize]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(rows.map((n) => n.id));
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }
    setSelected(newSelected);
  };

  const isSelected = (id: number) => selected.includes(id);

  return (
    <Paper elevation={0} className="WordsTable__container">
      {loading ? (
        <div className="WordsTable__loader">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="words table">
            <TableHead>
              <TableRow>
                <TableCell className="WordsTable__head-cell" padding="checkbox" sx={{ width: 60 }}>
                  <Checkbox
                    className="WordsTable__checkbox"
                    color="default"
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                    icon={<RadioButtonUncheckedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    indeterminateIcon={<CheckCircleIcon />}
                  />
                </TableCell>
                <TableCell className="WordsTable__head-cell">Слово</TableCell>
                <TableCell className="WordsTable__head-cell">Перевод</TableCell>
                <TableCell className="WordsTable__head-cell">Статус</TableCell>
                <TableCell className="WordsTable__head-cell" align="center">Прогресс изучения</TableCell>
                <TableCell className="WordsTable__head-cell" align="center">Дата добавления</TableCell>
                <TableCell className="WordsTable__head-cell" align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    className={`WordsTable__row${isItemSelected ? ' WordsTable__row--selected' : ''}`}
                  >
                    <TableCell className="WordsTable__body-cell" padding="checkbox">
                      <Checkbox
                        className="WordsTable__checkbox"
                        color="default"
                        checked={isItemSelected}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                      />
                    </TableCell>
                    <TableCell className="WordsTable__body-cell" component="th" scope="row">
                      {row.word}
                    </TableCell>
                    <TableCell className="WordsTable__body-cell">{row.translation}</TableCell>
                    <TableCell className="WordsTable__body-cell">
                      {row.learned ? 'Выучено' : 'Не выучено'}
                    </TableCell>
                    <TableCell className="WordsTable__body-cell" align="center">
                      <CustomProgress value={row.progress} />
                    </TableCell>
                    <TableCell className="WordsTable__body-cell" align="center">
                      {row.dateAdded}
                    </TableCell>
                    <TableCell className="WordsTable__body-cell" align="right">
                      <IconButton size="small">
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        className="WordsTable__pagination"
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          setPageSize(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
      />
    </Paper>
  );
}
