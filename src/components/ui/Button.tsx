import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  isLoading?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'h-11 px-5 rounded-xl font-heading font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-container shadow-md',
    secondary: 'bg-dark-slate text-white hover:bg-dark-surface',
    danger: 'bg-error text-white hover:bg-red-700',
    outline: 'bg-white border border-slate-300 text-slate-700 hover:bg-surface-low'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
      ) : icon ? (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
