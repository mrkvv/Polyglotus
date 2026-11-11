import { Box, Button, Paper, Typography } from '@mui/material'
import './HomePage.scss'
import { useGetDailyWordQuery, useGetPhraseQuery } from '@entities/reference/api/referenceApi';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { useGetUserMeQuery } from '@entities/user/api/uesrApi';
import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { data: phraseData } = useGetPhraseQuery();
  const { data: user } = useGetUserMeQuery();
  const { data: dailyWord } = useGetDailyWordQuery();

  const { t } = useTranslation();

  const currentStreak = user?.streak.current;


  return (
    <div className='HomePage'>
      <Typography className='HomePage__Title' variant='h3'>
        {phraseData?.phrase}
      </Typography>
      <div className="HomePage__Cards">
        <Paper className="HomePage__Card" variant="outlined" square={false}>
          <Box className='HomePage__Card__Circle'>
            <CircleOutlinedIcon sx={{ fontSize: "50px" }}/>
          </Box>
          <Typography variant="h4" sx={{ padding: '5px 30px' }}>
            {t('streak_title', { count: currentStreak})}
          </Typography>
          <Typography variant="h5" sx={{ padding: '26px 30px' }}>
            Пройдите тренировку сегодня, чтобы не потерять серию
            {/*TODO: useEffect на refetch по запросу стрика - проверять, что поле с датой изменилось ????*/}
          </Typography>
        </Paper>

        <Button disableElevation={true} disableRipple={true} sx={{ textTransform: 'none', textAlign: 'left' }}>
          <Paper className="HomePage__Card" variant="outlined" square={false}>
            <Typography variant="h4" sx={{ padding: '30px' }}>{t('new_word')}</Typography>
            <Typography variant="h3" sx={{ padding: '5px 30px', fontWeight: '700'}}>{dailyWord?.word}</Typography>
            <Typography variant="h5" sx={{ padding: '26px 30px' }}>{t('new_word_text')}</Typography>
          </Paper>
        </Button>

      </div>
    </div>
  )
}