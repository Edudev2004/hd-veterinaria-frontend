import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast, ToastItem, ToastType } from '@/components/ui/Toast';

export interface ShowToastOptions {
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: ShowToastOptions) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, message, duration = 5000 }: ShowToastOptions): string => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  // Interceptor global de eventos de error de servidor (500, 503, etc.)
  useEffect(() => {
    const handleServerError = (event: Event) => {
      const customEvent = event as CustomEvent<{ status?: number; message?: string }>;
      const status = customEvent.detail?.status ?? 500;
      const message =
        customEvent.detail?.message ||
        'Ocurrió un error en el servidor. Por favor, intenta de nuevo.';

      const title =
        status === 503
          ? 'Servicio No Disponible (503)'
          : `Error del Servidor (${status})`;

      showToast({
        type: 'error',
        title,
        message,
        duration: 6000,
      });
    };

    window.addEventListener('vethd:server-error', handleServerError);
    return () => {
      window.removeEventListener('vethd:server-error', handleServerError);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearToasts }}>
      {children}
      <div
        className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser utilizado dentro de un ToastProvider');
  }
  return context;
};
