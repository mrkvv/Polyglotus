// pages/auth-callback/index.tsx
import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useExchangeCodeMutation } from '@features/auth/api/authApi';
import type { User } from '@entities/user/model/types';

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [exchangeCode] = useExchangeCodeMutation();
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
      .then(async (response) => {
        const token = response.token;
        localStorage.setItem('token', token);

        try {
          const res = await fetch('http://localhost:8000/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const user: User = await res.json();
            const isNewUser = user.topicIds.length === 0;
            navigate(isNewUser ? '/login/step-1' : '/home');
          } else {
            // Не смогли получить юзера — на всякий случай отправляем в онбординг
            navigate('/login/step-1');
          }
        } catch {
          navigate('/login/step-1');
        }
      })
      .catch((error) => {
        console.error('Ошибка авторизации:', error);
        navigate('/login?error=auth_failed');
      });
  }, [searchParams, exchangeCode, navigate]);

  return true;
};