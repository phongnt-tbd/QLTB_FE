import React from 'react';

export interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  hint,
  error,
  children,
}) => {
  return (
    <div className="space-y-1">
      <label
        htmlFor={htmlFor}
        className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-[10px] text-slate-400 font-medium ml-1">{hint}</p>
      )}
      {error && (
        <p className="text-[10px] text-red-500 font-medium ml-1">{error}</p>
      )}
    </div>
  );
};

