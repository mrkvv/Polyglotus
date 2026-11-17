import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { WordRow } from '@widgets/words-table';

interface EditWordModalProps {
  open: boolean;
  row: WordRow | null;
  onSave: (id: number, en: string, ru: string) => Promise<void>;
  onClose: () => void;
}

export function EditWordModal({ open, row, onSave, onClose }: EditWordModalProps) {
  const { t } = useTranslation();
  const [en, setEn] = useState('');
  const [ru, setRu] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (row) {
      setEn(row.word);
      setRu(row.translation);
    }
  }, [row]);

  const handleSave = async () => {
    if (!row) return;
    setSaving(true);
    try {
      await onSave(row.id, en, ru);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: '12px', padding: '8px', minWidth: 360 } }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: 16, pb: 1 }}>
        {t('word_modal_edit_title')}
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          label={t('word_modal_field_word')}
          value={en}
          onChange={(e) => setEn(e.target.value)}
          size="small"
          fullWidth
          autoFocus
        />
        <TextField
          label={t('word_modal_field_translation')}
          value={ru}
          onChange={(e) => setRu(e.target.value)}
          size="small"
          fullWidth
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleSave}
          disabled={saving || !en.trim() || !ru.trim()}
          sx={{ color: '#2E7D32', fontWeight: 700 }}
        >
          {t('word_modal_save')}
        </Button>
        <Button onClick={onClose} color="inherit">
          {t('word_modal_cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
