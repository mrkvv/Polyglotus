import { Typography, Paper, Button, Box, TextField } from '@mui/material'
import './FillSentencePage.scss'
import { useTranslation } from 'react-i18next'

const MOCK_SENTENCE = 'She was so tired that she fell asleep as soon as her head hit the ______.'
const MOCK_PROGRESS = '1/3'

export function FillSentencePage() {
  const { t } = useTranslation()

  return (
    <div className="FillSentencePage">
      <div className="FillSentencePage__Header">
        <Typography className="FillSentencePage__Header__Title" variant="h3">
          {t('training_fill')}
        </Typography>
      </div>

      <div className="FillSentencePage__Content">
        <Typography className="FillSentencePage__Content__Description" variant="h5">
          {t('training_fill_desc')}
        </Typography>

        <Paper className="FillSentencePage__Card" variant="outlined" square={false}>
          <Box className="FillSentencePage__Card__Center">
            <Typography variant="h5" className="FillSentencePage__Card__Sentence">
              {MOCK_SENTENCE}
            </Typography>

            <Box className="FillSentencePage__Card__Controls">
              <TextField
                label="Введите слово"
                variant="outlined"
                size="small"
                className="FillSentencePage__Card__Controls__Input"
                sx={{ borderRadius: '999px' }}
              />
              <Button
                variant="outlined"
                sx={{ borderRadius: '999px', textTransform: 'none' }}
              >
                {t('check')}
              </Button>
              <Button
                variant="outlined"
                className="FillSentencePage__Card__Controls__Hint"
                sx={{ borderRadius: '999px', textTransform: 'none' }}
              >
                {t('hint')}
              </Button>
            </Box>
          </Box>

          <Typography
            className="FillSentencePage__Card__Progress"
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
