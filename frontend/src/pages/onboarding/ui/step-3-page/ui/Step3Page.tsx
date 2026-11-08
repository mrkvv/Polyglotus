import { useState } from 'react'
import { Typography, Button, Paper, Chip } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { onboardingStore } from '@entities/user'
import { useOnboardingContext } from '../../../model/useOnboardingContext';
import './Step3Page.scss'

export function Step3Page() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const { topics } = useOnboardingContext()

  const toggleTopic = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleContinue = () => {    
    onboardingStore.completeStep(3)
    navigate('/')
  }

  return (
    <div className="Step3Page">
      <Typography className="Step3Page__Header" variant="h2">
        {t('customizeHeader')}
      </Typography>
      <Typography className="Step3Page__Subtitle" variant="h3">
        {t('customizeStep3')}
      </Typography>

      <Paper className="Step3Page__Paper" variant="outlined" square={false}>
        <div className="Step3Page__Topics">
          {topics.map((topic) => (
            <Chip
              key={topic.id}
              label={topic.name}
              variant={selected.has(topic.id) ? 'filled' : 'outlined'}
              onClick={() => toggleTopic(topic.id)}
              className={`Step3Page__Chip${selected.has(topic.id) ? ' Step3Page__Chip--selected' : ''}`}
            />
          ))}
        </div>
      </Paper>

      <Button
        variant="contained"
        size="large"
        disabled={selected.size === 0}
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