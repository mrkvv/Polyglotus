import { useState } from 'react';
import { Dialog, DialogTitle, IconButton, Button, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { WordRow } from '@widgets/words-table';
import './FlashCardModal.scss';

interface FlashCardModalProps {
  open: boolean;
  words: WordRow[];
  onCorrect: (wordId: number) => void;
  onClose: () => void;
}

export function FlashCardModal({ open, words, onCorrect, onClose }: FlashCardModalProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = words[index];
  const isLast = index === words.length - 1;

  // words пришли пустыми или ещё не загружены — показываем заглушку
  if (!current && !finished) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <div className="FlashCard__finish">
          <Typography variant="body1" color="text.secondary">Нет слов для повторения</Typography>
        </div>
      </Dialog>
    );
  }

  const advance = () => {
    setFlipped(false);
    if (isLast) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleCorrect = () => {
    onCorrect(current.id);
    setCorrectCount((c) => c + 1);
    advance();
  };

  const handleWrong = () => {
    advance();
  };

  const handleClose = () => {
    // сбрасываем состояние при закрытии
    setIndex(0);
    setFlipped(false);
    setCorrectCount(0);
    setFinished(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          width: 480,
          maxWidth: '95vw',
          overflow: 'hidden',
          position: 'relative',
        },
      }}
    >
      <IconButton
        className="FlashCard__close"
        size="small"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {finished ? (
        <div className="FlashCard__finish">
          <Typography variant="h5">Отличная работа!</Typography>
          <Typography variant="h6" color="text.secondary">
            Сегодня вы выучили {correctCount} {wordLabel(correctCount)}
          </Typography>
        </div>
      ) : (
        <>
          <div
            className="FlashCard__scene"
            onClick={() => setFlipped((f) => !f)}
            role="button"
            aria-label="Перевернуть карточку"
          >
            <div className={`FlashCard__card${flipped ? ' FlashCard__card--flipped' : ''}`}>
              <div className="FlashCard__face FlashCard__face--front">
                <Typography variant="h4">
                  {current.word}
                </Typography>
              </div>
              <div className="FlashCard__face FlashCard__face--back">
                <Typography variant="h4" color="text.secondary">
                  {current.translation}
                </Typography>
              </div>
            </div>
          </div>

          <Divider />

          <div className="FlashCard__actions">
            <Button
              onClick={handleCorrect}
              sx={{ color: '#2E7D32', fontWeight: 700, fontSize: 14 }}
            >
              Верно
            </Button>
            <Button
              onClick={handleWrong}
              sx={{ color: '#999', fontWeight: 700, fontSize: 14 }}
            >
              Не верно
            </Button>
          </div>
        </>
      )}
    </Dialog>
  );
}

function wordLabel(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 14) return 'слов';
  if (n % 10 === 1) return 'слово';
  if (n % 10 >= 2 && n % 10 <= 4) return 'слова';
  return 'слов';
}
