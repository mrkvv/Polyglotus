// pages/onboarding/ui/step-1-page/Step1Page.tsx
import { useState } from 'react'
import { Paper, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './Step1Page.scss'
import { useTranslation } from 'react-i18next'
import { onboardingStore } from '@entities/user'
import { useOnboardingContext } from '../../../model/useOnboardingContext';

export function Step1Page() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { avatars } = useOnboardingContext()

  const handleContinue = () => {
    if (selectedId !== null) {
      onboardingStore.setAvatarId(selectedId)
    }
    onboardingStore.completeStep(1)
    navigate('/login/step-2')
  }

  return (
    <div className="Step1Page">
      <Typography className="Step1Page__Header" variant="h2">
        {t('customizeHeader')}
      </Typography>
      <Typography className="Step1Page__Subtitle" variant="h3">
        {t('customizeStep1')}
      </Typography>

      <Paper className="Step1Page__Paper" variant="outlined" square={false}>
        <div className="Step1Page__Grid">
          {avatars.map(({ id, svg }) => (
            <button
              key={id}
              className={`Step1Page__Slot${selectedId === id
                ? ' Step1Page__Slot--selected'
                : ''}`}
              onClick={() => setSelectedId(id)}
              aria-label={`Avatar ${id}`}
              aria-pressed={selectedId === id}
            >
              <div 
                className="Step1Page__Slot__Avatar" 
                dangerouslySetInnerHTML={{ __html: svg }} 
              />
            </button>
          ))}
        </div>
      </Paper>

      <Button
        className="Step1Page__Submit"
        variant="contained"
        disabled={selectedId === null}
        size="large"
        onClick={handleContinue}
        sx={{
          textTransform: 'none',
          fontSize: 18,
          backgroundColor: '#2E7D32',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#1B5E20' },
          '&.Mui-disabled': {
            backgroundColor: '#9e9e9e',
            color: '#ffffff',
          },
        }}
      >
        {t('continue')}
      </Button>
    </div>
  )
}