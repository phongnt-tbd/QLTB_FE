import React from 'react';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClass = 'inline-flex items-center justify-center font-black rounded-2xl transition-all uppercase tracking-widest focus:outline-none focus:ring-4';

  const variantClasses = {
    primary: 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700 focus:ring-blue-500/30 disabled:opacity-50',
    secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-500/30 disabled:opacity-50',
    danger: 'bg-red-600 text-white shadow-xl shadow-red-500/20 hover:bg-red-700 focus:ring-red-500/30 disabled:opacity-50',
    success: 'bg-green-600 text-white shadow-xl shadow-green-500/20 hover:bg-green-700 focus:ring-green-500/30 disabled:opacity-50',
    warning: 'bg-amber-600 text-white shadow-xl shadow-amber-500/20 hover:bg-amber-700 focus:ring-amber-500/30 disabled:opacity-50',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500/20 disabled:opacity-50',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const combinedClassName = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <i className="fas fa-spinner fa-spin mr-2"></i>
      )}
      {!isLoading && leftIcon && (
        <i className={`fas ${leftIcon} mr-2`}></i>
      )}
      {children}
      {!isLoading && rightIcon && (
        <i className={`fas ${rightIcon} ml-2`}></i>
      )}
    </button>
  );
};
