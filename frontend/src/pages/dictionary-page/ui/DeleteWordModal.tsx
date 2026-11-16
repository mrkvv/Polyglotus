import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WordRow } from '@widgets/words-table';

interface DeleteWordModalProps {
  open: boolean;
  rows: WordRow[];
  onConfirm: (rows: WordRow[]) => Promise<void>;
  onClose: () => void;
}

export function DeleteWordModal({ open, rows, onConfirm, onClose }: DeleteWordModalProps) {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState(false);
  const isBatch = rows.length > 1;

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm(rows);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const title = isBatch
    ? t('delete_modal_title_batch', { count: rows.length })
    : t('delete_modal_title_one', { word: rows[0]?.word });

  const description = isBatch
    ? t('delete_modal_desc_batch', { words: rows.map((r) => r.word).join(', ') })
    : t('delete_modal_desc_one');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '12px', padding: '8px', minWidth: 320 } }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: 16, pb: 1 }}>
        {title}
      </DialogTitle>

      <DialogContent sx={{ pt: '4px !important' }}>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleConfirm}
          disabled={deleting}
          sx={{ color: '#c62828', fontWeight: 700 }}
        >
          {t('delete_modal_confirm')}
        </Button>
        <Button onClick={onClose} color="inherit">
          {t('word_modal_cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
