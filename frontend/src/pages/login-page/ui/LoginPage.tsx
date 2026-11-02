import './LoginPage.scss'
import { useNavigate } from 'react-router-dom';
import {Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import yandexLogo from './YandexLogo.svg'

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="LoginPage">
      <Typography className='LoginPage__Header' variant='h1'>
        {t('greeting')}
      </Typography>
      <Button
        className="LoginPage__AuthButton"
        onClick={() => navigate('/login/step-1')}
        sx={{
          textTransform: 'none',
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: '45px',
        }}
      >
        <img src={yandexLogo}/>
        <span className="LoginPage__AuthButton-text">
          {t('loginButton')}
        </span>
      </Button>
    </div>
  )
}
