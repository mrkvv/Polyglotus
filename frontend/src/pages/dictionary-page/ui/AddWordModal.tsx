import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PARTS_OF_SPEECH } from '../model/types';

interface AddWordModalProps {
  open: boolean;
  onSave: (en: string, ru: string, partOfSpeech: string) => Promise<void>;
  onClose: () => void;
}

export function AddWordModal({ open, onSave, onClose }: AddWordModalProps) {
  const { t } = useTranslation();
  const [en, setEn] = useState('');
  const [ru, setRu] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(en.trim(), ru.trim(), partOfSpeech);
      setEn('');
      setRu('');
      setPartOfSpeech('');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setEn('');
    setRu('');
    setPartOfSpeech('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { borderRadius: '12px', padding: '8px', minWidth: 360 } }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: 16, pb: 1 }}>
        {t('word_modal_add_title')}
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
        <TextField
          label={t('word_modal_field_pos')}
          value={partOfSpeech}
          onChange={(e) => setPartOfSpeech(e.target.value)}
          size="small"
          fullWidth
          select
        >
          {PARTS_OF_SPEECH.map((pos) => (
            <MenuItem key={pos} value={pos}>
              {pos}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleSave}
          disabled={saving || !en.trim() || !ru.trim() || !partOfSpeech}
          sx={{ color: '#2E7D32', fontWeight: 700 }}
        >
          {t('word_modal_save')}
        </Button>
        <Button onClick={handleClose} color="inherit">
          {t('word_modal_cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
