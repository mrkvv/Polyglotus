import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, CircularProgress, Checkbox, IconButton,
  Menu, MenuItem, Divider, Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { CustomProgress, CustomProgressValue } from '@shared/ui/CustomProgress';
import { useTranslation } from 'react-i18next';
import './WordsTable.scss';

export type WordsFilter = 'all' | 'learned' | 'notLearned';
export type MenuAction = 'markLearned' | 'markUnlearned' | 'edit' | 'delete';

export interface WordRow {
  id: number;
  word: string;
  translation: string;
  partOfSpeech: string;
  learned: boolean;
  progress: CustomProgressValue;
  dateAdded: string;
}

interface WordsTableProps {
  rows: WordRow[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onMenuAction: (action: MenuAction, rows: WordRow[]) => void;
}

export function WordsTable({
  rows,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
  onMenuAction,
}: WordsTableProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number[]>([]);

  // ── Контекстное меню ──────────────────────────────────
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuRow, setMenuRow] = useState<WordRow | null>(null);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, row: WordRow) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuRow(null);
  };

  // Если выделено несколько — действие применяется ко всем выделенным.
  // Иначе — только к строке, на которой открыли меню.
  const handleMenuAction = (action: MenuAction) => {
    if (!menuRow) return;
    const isMulti = selected.length > 1 && selected.includes(menuRow.id);
    const targetRows = isMulti
      ? rows.filter((r) => selected.includes(r.id))
      : [menuRow];
    onMenuAction(action, targetRows);
    handleMenuClose();
  };

  const isMultiSelect = selected.length > 1;

  // ── Выделение строк ───────────────────────────────────
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(rows.map((n) => n.id));
      return;
    }
    setSelected([]);
  };

  const handleRowClick = (_event: React.MouseEvent<unknown>, id: number) => {
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
                <TableCell className="WordsTable__head-cell">{t('table_col_word')}</TableCell>
                <TableCell className="WordsTable__head-cell">{t('table_col_translation')}</TableCell>
                <TableCell className="WordsTable__head-cell">{t('table_col_status')}</TableCell>
                <TableCell className="WordsTable__head-cell" align="center">{t('table_col_progress')}</TableCell>
                <TableCell className="WordsTable__head-cell" align="center">{t('table_col_date')}</TableCell>
                <TableCell className="WordsTable__head-cell" align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleRowClick(event, row.id)}
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
                      {row.learned ? t('table_status_learned') : t('table_status_not_learned')}
                    </TableCell>
                    <TableCell className="WordsTable__body-cell" align="center">
                      <CustomProgress value={row.progress} />
                    </TableCell>
                    <TableCell className="WordsTable__body-cell" align="center">
                      {row.dateAdded}
                    </TableCell>
                    <TableCell className="WordsTable__body-cell" align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
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

      {/* ── Контекстное меню ── */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { borderRadius: '10px', minWidth: 200, py: 0.5 },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleMenuAction('markLearned')}>
          <Typography variant="body2">{t('table_menu_mark_learned')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('markUnlearned')}>
          <Typography variant="body2">{t('table_menu_mark_unlearned')}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleMenuAction('edit')} disabled={isMultiSelect}>
          <Typography variant="body2" color={isMultiSelect ? 'text.disabled' : 'text.primary'}>
            {t('table_menu_edit')}
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>
          <Typography variant="body2" color="error">{t('table_menu_delete')}</Typography>
        </MenuItem>
      </Menu>

      <TablePagination
        className="WordsTable__pagination"
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          onPageSizeChange(parseInt(e.target.value, 10));
        }}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        labelRowsPerPage={t('table_rows_per_page')}
        labelDisplayedRows={({ from, to, count, page: p }) =>
          t('table_page_of', { page: p + 1, from, to, count })
        }
      />
    </Paper>
  );
}
