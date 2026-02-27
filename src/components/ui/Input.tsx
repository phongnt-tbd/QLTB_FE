import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  className = '',
  ...rest
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <input
        {...rest}
        className={[
          'w-full px-5 py-3.5 bg-slate-50 border rounded-2xl outline-none font-bold text-sm transition-all',
          error
            ? 'border-red-400 focus:ring-4 focus:ring-red-500/15'
            : 'border-slate-200 focus:ring-4 focus:ring-blue-500/10',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      {hint && !error && (
        <p className="text-[10px] text-slate-400 font-medium ml-1">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] text-red-500 font-medium ml-1">{error}</p>
      )}
    </div>
  );
};

