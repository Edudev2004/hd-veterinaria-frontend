import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'healthy' | 'warning' | 'pending' | 'confirmed';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'healthy' }) => {
  const styles = {
    healthy: 'bg-emerald-100/80 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100/80 text-amber-700 border-amber-200',
    pending: 'bg-slate-100 text-slate-600 border-slate-200',
    confirmed: 'bg-amber-100 text-amber-800 border-amber-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${styles[variant]}`}
    >
      {variant === 'healthy' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
      {variant === 'warning' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
      {children}
    </span>
  );
};
