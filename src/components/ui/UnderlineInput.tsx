import React from 'react';

interface UnderlineInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  rightElement?: React.ReactNode;
}

export const UnderlineInput: React.FC<UnderlineInputProps> = ({
  label,
  icon,
  error,
  rightElement,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1 w-full text-left">
      <label htmlFor={inputId} className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>
      <div className="relative flex items-center border-b-2 border-slate-200 focus-within:border-[#0D7C84] transition-colors py-1.5">
        <input
          id={inputId}
          className={`w-full bg-transparent text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none pr-8 py-1 ${className}`}
          {...props}
        />
        {rightElement ? (
          <div className="absolute right-0 text-slate-400 hover:text-[#0D7C84] transition-colors">
            {rightElement}
          </div>
        ) : icon ? (
          <div className="absolute right-0 text-slate-400 pointer-events-none">
            {icon}
          </div>
        ) : null}
      </div>
      {error && <p className="text-[11px] text-rose-500 font-semibold mt-1">{error}</p>}
    </div>
  );
};
