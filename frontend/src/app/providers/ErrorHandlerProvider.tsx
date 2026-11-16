// src/app/providers/ErrorHandlerProvider.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, Button } from '@mui/material';

export const UNAUTHORIZED_EVENT = 'api-unauthorized';
export const API_ERROR_EVENT = 'api-error';

interface ApiErrorDetail {
  status: number | string;
}

interface ToastItem {
  id: number;
  status: number | string;
}

let toastIdCounter = 0;

export function ErrorHandlerProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [unauthorizedOpen, setUnauthorizedOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUnauthorizedOpen(true);
    };

    const handleApiError = (e: Event) => {
      const { status } = (e as CustomEvent<ApiErrorDetail>).detail;
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, status }]);
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    window.addEventListener(API_ERROR_EVENT, handleApiError);
    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
      window.removeEventListener(API_ERROR_EVENT, handleApiError);
    };
  }, []);

  const handleUnauthorizedClose = () => {
    setUnauthorizedOpen(false);
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  const formatStatus = (status: number | string) => {
    if (typeof status === 'number') return `Ошибка ${status}`;
    // RTK Query может вернуть строку 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' и т.д.
    if (status === 'FETCH_ERROR') return 'Нет соединения с сервером';
    if (status === 'TIMEOUT_ERROR') return 'Превышено время ожидания';
    if (status === 'PARSING_ERROR') return 'Ошибка обработки ответа';
    return `Ошибка: ${status}`;
  };

  return (
    <>
      {children}

      {/* ── Ошибка авторизации ── */}
      <Snackbar open={unauthorizedOpen} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert
          severity="error"
          variant="filled"
          action={
            <Button color="inherit" size="small" onClick={handleUnauthorizedClose}>
              ОК
            </Button>
          }
        >
          Сессия истекла. Пожалуйста, войдите снова.
        </Alert>
      </Snackbar>

      {/* ── Очередь API-ошибок ── */}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open
          autoHideDuration={4000}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          // Смещаем каждый следующий тост вверх, чтобы не накладывались
          sx={{ bottom: (theme) => `${24 + index * 72}px !important` }}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={() => removeToast(toast.id)}
          >
            {formatStatus(toast.status)}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}
