import React from 'react';

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Tìm kiếm...',
  className = '',
  ...rest
}) => {
  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
        <i className="fas fa-search" />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        {...rest}
        className={[
          'block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  );
};

