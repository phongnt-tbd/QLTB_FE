import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20',
  secondary: 'bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-900/20',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xl shadow-red-500/20',
  ghost: 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50',
  link: 'bg-transparent text-blue-600 hover:text-blue-700 hover:underline px-0 py-0 border-none shadow-none',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all';
  const widthClass = fullWidth ? 'w-full' : '';
  const finalDisabled = disabled || isLoading;

  return (
    <button
      {...rest}
      disabled={finalDisabled}
      className={[
        base,
        variantClasses[variant],
        widthClass,
        finalDisabled ? 'opacity-60 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading && <i className="fas fa-circle-notch fa-spin mr-2 text-[10px]" />}
      {children}
    </button>
  );
};

