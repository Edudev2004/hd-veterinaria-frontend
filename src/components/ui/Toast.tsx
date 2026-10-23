import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X, AlertCircle } from 'lucide-react';

export type ToastType = 'error' | 'warning' | 'success' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const TYPE_CONFIG = {
  error: {
    icon: AlertCircle,
    containerClasses: 'bg-red-50 border-red-200 text-red-800 shadow-red-100',
    iconClasses: 'text-red-500 bg-red-100',
    defaultTitle: 'Error del servidor',
  },
  warning: {
    icon: AlertTriangle,
    containerClasses: 'bg-amber-50 border-amber-200 text-amber-800 shadow-amber-100',
    iconClasses: 'text-amber-500 bg-amber-100',
    defaultTitle: 'Advertencia',
  },
  success: {
    icon: CheckCircle2,
    containerClasses: 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100',
    iconClasses: 'text-emerald-500 bg-emerald-100',
    defaultTitle: 'Operación exitosa',
  },
  info: {
    icon: Info,
    containerClasses: 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100',
    iconClasses: 'text-blue-500 bg-blue-100',
    defaultTitle: 'Información',
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.error;
  const IconComponent = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm ${config.containerClasses}`}
      role="alert"
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.iconClasses}`}>
        <IconComponent className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="text-sm font-semibold tracking-tight">
          {toast.title || config.defaultTitle}
        </h4>
        <p className="mt-0.5 text-xs leading-relaxed opacity-90 break-words">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-black/5 hover:text-gray-700"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};
