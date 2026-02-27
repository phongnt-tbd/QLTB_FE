import React from 'react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  iconClassName?: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  iconClassName,
  onClose,
  children,
  maxWidthClassName = 'max-w-md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div
        className={[
          'bg-white rounded-[3rem] w-full p-10 shadow-2xl animate-in zoom-in-95 duration-200',
          maxWidthClassName,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {iconClassName && (
              <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600">
                <i className={iconClassName} />
              </div>
            )}
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-10 h-10 rounded-full p-0 text-slate-400 hover:text-slate-600"
            onClick={onClose}
          >
            <i className="fas fa-times text-xl" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

