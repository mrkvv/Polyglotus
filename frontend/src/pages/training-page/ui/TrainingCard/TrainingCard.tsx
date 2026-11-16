import { Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useTranslation } from 'react-i18next'
import './TrainingCard.scss'

export interface TrainingCardProps {
  title: string
  description: string
  color: 'yellow' | 'green'
  onClick: () => void
}

export function TrainingCard({ title, description, color, onClick }: TrainingCardProps) {
  const { t } = useTranslation()

  return (
    <div className={`TrainingCard TrainingCard--${color}`}>
      <div className="TrainingCard__Body">
        <Typography className="TrainingCard__Title" variant="h4">
          {title}
        </Typography>
        <Typography className="TrainingCard__Description" variant="h6">
          {description}
        </Typography>
      </div>
      <button className="TrainingCard__Button" onClick={onClick}>
        <span>{t('to_training')}</span>
        <ArrowForwardIosIcon className="TrainingCard__Button__Icon" />
      </button>
    </div>
  )
}
