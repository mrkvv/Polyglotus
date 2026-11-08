import { useState } from 'react'
import {
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Paper
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { onboardingStore } from '@entities/user'
import { useOnboardingContext } from '../../../model/useOnboardingContext';
import './Step2Page.scss'

export function Step2Page() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const { levels } = useOnboardingContext()

  const handleContinue = () => {
    if (selectedLevel !== null) {
      onboardingStore.setLevelId(selectedLevel)
    }
    onboardingStore.completeStep(2)
    navigate('/login/step-3')
  }

  return (
    <div className="Step2Page">
      <Typography className="Step2Page__Header" variant="h2">
        {t('customizeHeader')}
      </Typography>
      <Typography className="Step2Page__Subtitle" variant="h3">
        {t('customizeStep2')}
      </Typography>

      <Paper className='Step2Page__Form' variant='outlined' square={false}>
        <FormControl component="fieldset">
          <RadioGroup
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(Number(e.target.value))}
          >
            {levels.map((level) => (
              <FormControlLabel
                key={level.id}
                value={level.id}
                control={<Radio />}
                label={level.name} 
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>

      <Button
        variant="contained"
        size="large"
        disabled={selectedLevel === null}
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