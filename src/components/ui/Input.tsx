import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  isPassword = false,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="font-medium text-sm text-dark-slate flex items-center gap-1">
          <span>{label}</span>
          {props.required && <span className="text-error text-xs">*</span>}
        </label>
      </div>

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3.5 text-slate-400 material-symbols-outlined text-[20px] pointer-events-none">
            {icon}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          className={`w-full h-11 ${icon ? 'pl-11' : 'pl-4'} ${
            isPassword ? 'pr-11' : 'pr-4'
          } rounded-xl bg-surface-low border border-slate-200 text-dark-slate text-sm focus:outline-none focus:bg-white focus:border-primary transition-colors ${
            error ? 'border-error bg-red-50/30' : ''
          } ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>

      {error && <span className="text-xs text-error font-medium">{error}</span>}
    </div>
  );
};
