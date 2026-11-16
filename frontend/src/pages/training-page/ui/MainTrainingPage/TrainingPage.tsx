import { Typography } from '@mui/material'
import './TrainingPage.scss'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TrainingCard } from '../TrainingCard/TrainingCard'
import { TRAINING_CARDS } from '../../model/trainingCards'

export function TrainingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="TrainingPage">
      <div className="TrainingPage__Header">
        <Typography className="TrainingPage__Header__Title" variant="h3">
          {t('training')}
        </Typography>
      </div>

      <div className="TrainingPage__Content">
        <Typography className="TrainingPage__Content__Description" variant="h5">
          {t('trainingDescription')}
        </Typography>

        <div className="TrainingPage__Grid">
          {TRAINING_CARDS.map((card) => (
            <TrainingCard
              key={card.path}
              title={t(card.titleKey)}
              description={t(card.descriptionKey)}
              color={card.color}
              onClick={() => navigate(card.path)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
