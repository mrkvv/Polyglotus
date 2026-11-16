import { Typography, Paper, Button, Box } from '@mui/material'
import './TranslationToWordPage.scss'
import { useTranslation } from 'react-i18next'

const MOCK_WORD = 'Путешествие'
const MOCK_OPTIONS = ['DESTINATION', 'JOURNEY', 'SCHEDULE', 'TICKET']
const MOCK_PROGRESS = '1/5'

export function TranslationToWordPage() {
  const { t } = useTranslation()

  return (
    <div className="TranslationToWordPage">
      <div className="TranslationToWordPage__Header">
        <Typography className="TranslationToWordPage__Header__Title" variant="h3">
          {t('training_translation_to_word')}
        </Typography>
      </div>

      <div className="TranslationToWordPage__Content">
        <Typography className="TranslationToWordPage__Content__Description" variant="h5">
          {t('training_translation_to_word_desc')}
        </Typography>

        <Paper className="TranslationToWordPage__Card" variant="outlined" square={false}>
          <Box className="TranslationToWordPage__Card__Center">
            <Typography variant="h2" fontWeight={700}>
              {MOCK_WORD}
            </Typography>
          </Box>

          <Box className="TranslationToWordPage__Card__Options">
            {MOCK_OPTIONS.map((option) => (
              <Button
                key={option}
                variant="outlined"
                className="TranslationToWordPage__Card__Options__Btn"
                sx={{ borderRadius: '999px', textTransform: 'none' }}
              >
                {option}
              </Button>
            ))}
          </Box>

          <Typography
            className="TranslationToWordPage__Card__Progress"
            variant="h4"
            fontWeight={700}
          >
            {MOCK_PROGRESS}
          </Typography>
        </Paper>
      </div>
    </div>
  )
}
