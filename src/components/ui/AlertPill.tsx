import React from 'react';

interface AlertPillProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title: string;
  badgeText?: string;
  icon?: string;
}

export const AlertPill: React.FC<AlertPillProps> = ({
  type = 'error',
  title,
  badgeText,
  icon = 'error'
}) => {
  const typeStyles = {
    error: 'bg-error-container text-error-onContainer border border-red-200',
    warning: 'bg-amber-100 text-amber-900 border border-amber-300',
    info: 'bg-sky-100 text-sky-900 border border-sky-300',
    success: 'bg-emerald-100 text-emerald-900 border border-emerald-300'
  };

  const badgeStyles = {
    error: 'bg-error text-white',
    warning: 'bg-amber-600 text-white',
    info: 'bg-sky-600 text-white',
    success: 'bg-emerald-600 text-white'
  };

  return (
    <div className={`p-3 px-4 rounded-xl flex items-center justify-between gap-2 shadow-sm transition-all animate-fade-in ${typeStyles[type]}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="material-symbols-outlined text-[20px] shrink-0">{icon}</span>
        <span className="text-xs font-semibold truncate">{title}</span>
      </div>

      {badgeText && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${badgeStyles[type]}`}>
          {badgeText}
        </span>
      )}
    </div>
  );
};
