import React from 'react';
import { User, UserRole } from '@/types';
import { UserRowActions } from './UserRowActions';

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleLock: (userId: string) => void;
  onDelete: (userId: string) => void;
  onResetPassword: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onToggleLock,
  onDelete,
  onResetPassword,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Người dùng
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Liên hệ
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Vai trò
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Trạng thái
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-11 w-11 rounded-2xl border border-slate-100"
                      src={user.avatar}
                      alt={user.fullName}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-black text-slate-900 leading-tight">
                        {user.fullName}
                      </div>
                      <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-slate-700">
                    {user.email}
                  </div>
                  <div className="text-[10px] text-slate-400 font-bold">
                    {user.phone}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span
                    className={[
                      'px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm',
                      user.role === UserRole.SYSTEM_ADMIN
                        ? 'bg-indigo-100 text-indigo-700'
                        : user.role === UserRole.ASSET_MANAGER
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-center">
                  <span
                    className={[
                      'px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm',
                      user.isLocked
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {user.isLocked ? 'Bị khóa' : 'Hoạt động'}
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-right">
                  <UserRowActions
                    user={user}
                    onEdit={onEdit}
                    onToggleLock={onToggleLock}
                    onDelete={onDelete}
                    onResetPassword={onResetPassword}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

