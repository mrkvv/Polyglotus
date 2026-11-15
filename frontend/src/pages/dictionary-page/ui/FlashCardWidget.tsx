import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './FlashCardWidget.scss';
import { Button, Typography } from '@mui/material';

interface FlashCardWidgetProps {
  onClick: () => void;
}

export function FlashCardWidget({ onClick }: FlashCardWidgetProps) {
  return (
    <div className="FlashCardWidget">
      <Button
        className="FlashCardWidget__btn"
        onClick={onClick}
        disableRipple
        sx={{ textTransform: 'none', overflow: 'hidden', borderRadius: '16px' }}
      >
        <Typography className="FlashCardWidget__label" variant='h4'>
          Карточки
        </Typography>
        <ContentCopyIcon sx={{ fontSize: 64, color: 'var(--color-flashcard-accent)' }} />
      </Button>
    </div>
  );
}
