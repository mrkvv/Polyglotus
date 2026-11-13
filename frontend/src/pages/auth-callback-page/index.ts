// pages/auth-callback/index.tsx
import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useExchangeCodeMutation } from '@features/auth/api/authApi';

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [exchangeCode, { isLoading, isError }] = useExchangeCodeMutation();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get('code');
    
    if (!code) {
      navigate('/login');
      return;
    }

    exchangeCode({ code })
      .unwrap()
      .then((response) => {
        localStorage.setItem('token', response.token);
        navigate('/login/step-1');
      })
      .catch((error) => {
        console.error('Ошибка авторизации:', error);
        navigate('/login?error=auth_failed');
      });
  }, [searchParams, exchangeCode, navigate]);

  return true;
};