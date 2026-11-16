import { Typography, Paper, Button, Box } from '@mui/material'
import './PairsPage.scss'
import { useTranslation } from 'react-i18next'

const MOCK_EN = ['HARVEST', 'BRIDGE', 'WHISTLE', 'SHADOW', 'PILLOW']
const MOCK_RU = ['ПОДУШКА', 'УРОЖАЙ', 'СВИСТОК', 'МОСТ', 'ТЕНЬ']
const MOCK_PROGRESS = '1/3'

export function PairsPage() {
  const { t } = useTranslation()

  return (
    <div className="PairsPage">
      <div className="PairsPage__Header">
        <Typography className="PairsPage__Header__Title" variant="h3">
          {t('training_pairs')}
        </Typography>
      </div>

      <div className="PairsPage__Content">
        <Typography className="PairsPage__Content__Description" variant="h5">
          {t('training_pairs_desc')}
        </Typography>

        <Paper className="PairsPage__Card" variant="outlined" square={false}>
          <Box className="PairsPage__Card__Center">
            <Box className="PairsPage__Card__Row">
              {MOCK_EN.map((word) => (
                <Button
                  key={word}
                  variant="outlined"
                  className="PairsPage__Card__Row__Btn PairsPage__Card__Row__Btn--en"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {word}
                </Button>
              ))}
            </Box>

            <Box className="PairsPage__Card__Row">
              {MOCK_RU.map((word) => (
                <Button
                  key={word}
                  variant="outlined"
                  className="PairsPage__Card__Row__Btn PairsPage__Card__Row__Btn--ru"
                  sx={{ borderRadius: '999px', textTransform: 'none' }}
                >
                  {word}
                </Button>
              ))}
            </Box>
          </Box>

          <Typography
            className="PairsPage__Card__Progress"
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
