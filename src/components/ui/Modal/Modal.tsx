import React from 'react';
import type { ModalProps } from './Modal.types';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div
        className={`bg-white rounded-[3rem] w-full ${sizeClasses[size]} shadow-2xl p-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
          {showCloseButton && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
