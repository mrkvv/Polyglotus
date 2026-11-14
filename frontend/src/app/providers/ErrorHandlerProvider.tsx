// src/app/providers/ErrorHandlerProvider.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Button } from '@mui/material';

// Создаем кастомное событие для общения вне React-дерева (из RTK Query)
export const UNAUTHORIZED_EVENT = 'api-unauthorized';

export function ErrorHandlerProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setOpen(true);
    };

    // Подписываемся на кастомное событие
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          action={
            <Button color="inherit" size="small" onClick={handleClose}>
              ОК
            </Button>
          }
        >
          Сессия истекла. Пожалуйста, войдите снова.
        </Alert>
      </Snackbar>
    </>
  );
}