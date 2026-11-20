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

function isUnsupportedSymbol(e: unknown): boolean {
  const data = (e as { data?: { error?: string } })?.data;
  return data?.error === 'UNSUPPORTED_SYMBOL';
}

function isSizeExceeded(e: unknown): boolean {
  const data = (e as { data?: { error?: string } })?.data;
  return data?.error === 'WORDS_SIZE_EXCEEDED';
}

function getSizeExceededField(e: unknown, en: string, ru: string): 'en' | 'ru' | 'both' {
  const enBad = en.trim().length > 30;
  const ruBad = ru.trim().length > 30;
  if (enBad && ruBad) return 'both';
  if (enBad) return 'en';
  if (ruBad) return 'ru';
  return 'both'; // fallback
}

function getInvalidAlphabetField(e: unknown, en: string, ru: string): 'en' | 'ru' | null {
  const data = (e as { data?: { error?: string; message?: string } })?.data;
  if (data?.error !== 'INVALID_ALPHABET') return null;
  const match = data.message?.match(/Word: '([^']+)'/);
  const badWord = match?.[1];
  if (!badWord) return 'en';
  if (badWord === en.trim()) return 'en';
  if (badWord === ru.trim()) return 'ru';
  return 'en';
}

export function EditWordModal({ open, row, onSave, onClose }: EditWordModalProps) {
  const { t } = useTranslation();
  const [en, setEn] = useState('');
  const [ru, setRu] = useState('');
  const [saving, setSaving] = useState(false);
  const [enError, setEnError] = useState<string | null>(null);
  const [ruError, setRuError] = useState<string | null>(null);

  useEffect(() => {
    if (row) {
      setEn(row.word);
      setRu(row.translation);
      setEnError(null);
      setRuError(null);
    }
  }, [row]);

  const handleSave = async () => {
    if (!row) return;
    setEnError(null);
    setRuError(null);

    let hasError = false;
    if (!en.trim()) { setEnError(t('word_modal_empty_field')); hasError = true; }
    if (!ru.trim()) { setRuError(t('word_modal_empty_field')); hasError = true; }
    if (hasError) return;

    setSaving(true);
    try {
      await onSave(row.id, en, ru);
      onClose();
    } catch (e) {
      if (isUnsupportedSymbol(e)) {
        setEnError(t('word_modal_unsupported_symbol'));
        setRuError(t('word_modal_unsupported_symbol'));
      } else if (isSizeExceeded(e)) {
        const field = getSizeExceededField(e, en, ru);
        if (field === 'en' || field === 'both') setEnError(t('word_modal_size_exceeded'));
        if (field === 'ru' || field === 'both') setRuError(t('word_modal_size_exceeded'));
      } else {
        const field = getInvalidAlphabetField(e, en, ru);
        if (field === 'en') setEnError(t('word_modal_invalid_alphabet_en'));
        else if (field === 'ru') setRuError(t('word_modal_invalid_alphabet_ru'));
      }
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
          onChange={(e) => { setEn(e.target.value); setEnError(null); }}
          size="small"
          fullWidth
          autoFocus
          autoComplete="off"
          error={!!enError}
          helperText={enError ?? ' '}
        />
        <TextField
          label={t('word_modal_field_translation')}
          value={ru}
          onChange={(e) => { setRu(e.target.value); setRuError(null); }}
          size="small"
          fullWidth
          autoComplete="off"
          error={!!ruError}
          helperText={ruError ?? ' '}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleSave}
          disabled={saving}
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
