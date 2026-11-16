import { Typography, Paper, Button, Box } from '@mui/material'
import './WordToTranslationPage.scss'
import { useTranslation } from 'react-i18next'

const MOCK_WORD = 'Cucumber'
const MOCK_OPTIONS = ['ПОМИДОР', 'ОГУРЕЦ', 'КАПУСТА', 'МОРКОВЬ']
const MOCK_PROGRESS = '1/5'

export function WordToTranslationPage() {
  const { t } = useTranslation()

  return (
    <div className="WordToTranslationPage">
      <div className="WordToTranslationPage__Header">
        <Typography className="WordToTranslationPage__Header__Title" variant="h3">
          {t('training_word_to_translation')}
        </Typography>
      </div>

      <div className="WordToTranslationPage__Content">
        <Typography className="WordToTranslationPage__Content__Description" variant="h5">
          {t('training_word_to_translation_desc')}
        </Typography>

        <Paper className="WordToTranslationPage__Card" variant="outlined" square={false}>
          <Box className="WordToTranslationPage__Card__Center">
            <Typography variant="h2">
              {MOCK_WORD}
            </Typography>
          </Box>

          <Box className="WordToTranslationPage__Card__Options">
            {MOCK_OPTIONS.map((option) => (
              <Button
                key={option}
                variant="outlined"
                className="WordToTranslationPage__Card__Options__Btn"
                sx={{ borderRadius: '999px', textTransform: 'none' }}
              >
                {option}
              </Button>
            ))}
          </Box>

          <Typography
            className="WordToTranslationPage__Card__Progress"
            variant="h4"
          >
            {MOCK_PROGRESS}
          </Typography>
        </Paper>
      </div>
    </div>
  )
}
