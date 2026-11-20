import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './FlashCardWidget.scss';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface FlashCardWidgetProps {
  onClick: () => void;
}

export function FlashCardWidget({ onClick }: FlashCardWidgetProps) {
  const { t } = useTranslation();

  return (
    <div className="FlashCardWidget">
      <Button
        className="FlashCardWidget__btn"
        onClick={onClick}
        disableRipple
        sx={{ textTransform: 'none', overflow: 'hidden', borderRadius: '16px' }}
      >
        <Typography className="FlashCardWidget__label" variant='h4'>
          {t('flashcard_widget_label')}
        </Typography>
        <ContentCopyIcon sx={{ fontSize: 64, color: 'var(--color-flashcard-accent)' }} />
      </Button>
    </div>
  );
}
