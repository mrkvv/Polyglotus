import { useState } from 'react';
import { Dialog, IconButton, Button, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { WordRow } from '@widgets/words-table';
import './FlashCardModal.scss';

interface FlashCardModalProps {
  open: boolean;
  words: WordRow[];
  onFinish: (correctIds: number[]) => void;
  onClose: () => void;
}

export function FlashCardModal({ open, words, onFinish, onClose }: FlashCardModalProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correctIds, setCorrectIds] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const current = words[index];
  const isLast = index === words.length - 1;

  const reset = () => {
    setIndex(0);
    setFlipped(false);
    setCorrectIds([]);
    setFinished(false);
  };

  const finish = (ids: number[]) => {
    setFinished(true);
    onFinish(ids);
  };

  const advance = (ids: number[]) => {
    setFlipped(false);
    if (isLast) {
      finish(ids);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleCorrect = () => {
    const ids = [...correctIds, current.id];
    setCorrectIds(ids);
    advance(ids);
  };

  const handleWrong = () => {
    advance(correctIds);
  };

  const handleClose = () => {
    if (!finished && correctIds.length > 0) {
      onFinish(correctIds);
    }
    onClose();
    setTimeout(reset, 300);
  };

  // Нет невыученных слов
  if (!current && !finished) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { borderRadius: '16px', width: 480, maxWidth: '95vw', overflow: 'hidden', position: 'relative' } }}
      >
        <IconButton className="FlashCard__close" size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
        <div className="FlashCard__finish">
          <Typography variant="h5">Вы всё знаете!</Typography>
          <Typography variant="h6" color="text.secondary">Нет слов для повторения</Typography>
        </div>
      </Dialog>
    );
  }

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
      <IconButton className="FlashCard__close" size="small" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>

      {finished ? (
        <div className="FlashCard__finish">
          <Typography variant="h5">Отличная работа!</Typography>
          <Typography variant="h6" color="text.secondary">
            Сегодня вы выучили {correctIds.length} {wordLabel(correctIds.length)}
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
                <Typography variant="h4">{current.word}</Typography>
              </div>
              <div className="FlashCard__face FlashCard__face--back">
                <Typography variant="h4" color="text.secondary">{current.translation}</Typography>
              </div>
            </div>
          </div>

          <Divider />

          <div className="FlashCard__actions">
            <Button onClick={handleCorrect} sx={{ color: '#2E7D32', fontWeight: 700, fontSize: 14 }}>
              Верно
            </Button>
            <Button onClick={handleWrong} sx={{ color: '#999', fontWeight: 700, fontSize: 14 }}>
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
