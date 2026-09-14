import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden font-extrabold tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 rounded-xl px-7 py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer border-2 shadow-[0_3px_0_1px_rgba(13,124,132,0.3)]
        ${fullWidth ? 'w-full' : ''}
        ${
          variant === 'primary'
            ? 'bg-[#0D7C84] text-white border-[#0D7C84] hover:bg-[#0b686f] hover:border-[#0b686f] hover:shadow-[0_4px_14px_rgba(13,124,132,0.35)]'
            : variant === 'secondary'
            ? 'bg-[#F59E0B] text-slate-950 border-[#F59E0B] hover:bg-[#d97706] hover:text-white'
            : 'bg-transparent text-slate-800 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
        }
        group
        ${className}
      `}
      {...props}
    >
      {/* Animated Skew Light Bar (#F59E0B / Amber shine effect - 1s duration) */}
      <span className="absolute top-1/2 left-0 w-28 h-[160%] bg-[#F59E0B] opacity-90 -translate-y-1/2 skew-x-[30deg] -translate-x-44 transition-transform duration-1000 ease-in-out group-hover:translate-x-[480px]" />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          children
        )}
      </span>
    </button>
  );
};
