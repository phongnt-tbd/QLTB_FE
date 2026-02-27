import React from 'react';
import { User } from '@/types';

export interface UserRowActionsProps {
  user: User;
  onEdit: (user: User) => void;
  onToggleLock: (userId: string) => void;
  onDelete: (userId: string) => void;
  onResetPassword: (user: User) => void;
}

export const UserRowActions: React.FC<UserRowActionsProps> = ({
  user,
  onEdit,
  onToggleLock,
  onDelete,
  onResetPassword,
}) => {
  return (
    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        type="button"
        onClick={() => onEdit(user)}
        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
        title="Sửa"
      >
        <i className="fas fa-edit" />
      </button>
      <button
        type="button"
        onClick={() => onToggleLock(user.id)}
        className={[
          'w-10 h-10 flex items-center justify-center bg-white border border-slate-200 hover:text-white rounded-xl transition-all shadow-sm',
          user.isLocked
            ? 'text-green-600 hover:bg-green-600'
            : 'text-amber-600 hover:bg-amber-600',
        ]
          .filter(Boolean)
          .join(' ')}
        title={user.isLocked ? 'Mở khóa' : 'Khóa'}
      >
        <i className={`fas ${user.isLocked ? 'fa-unlock' : 'fa-lock'}`} />
      </button>
      <button
        type="button"
        onClick={() => onResetPassword(user)}
        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-xl transition-all shadow-sm"
        title="Reset Mật khẩu"
      >
        <i className="fas fa-key" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(user.id)}
        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
        title="Xóa"
      >
        <i className="fas fa-trash-alt" />
      </button>
    </div>
  );
};

