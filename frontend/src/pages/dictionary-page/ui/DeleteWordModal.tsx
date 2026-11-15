import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography,
} from '@mui/material';
import type { WordRow } from '@widgets/words-table';

interface DeleteWordModalProps {
  open: boolean;
  rows: WordRow[];
  onConfirm: (rows: WordRow[]) => Promise<void>;
  onClose: () => void;
}

export function DeleteWordModal({ open, rows, onConfirm, onClose }: DeleteWordModalProps) {
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
    ? `Удалить ${rows.length} слова?`
    : `Удалить слово ${rows[0]?.word}?`;

  const description = isBatch
    ? `Будут удалены слова: ${rows.map((r) => r.word).join(', ')}. Это действие нельзя отменить.`
    : 'Это действие нельзя отменить.';

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
          Удалить
        </Button>
        <Button onClick={onClose} color="inherit">
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
}
