import React from 'react';
import { PasswordFormData } from '../types';

interface PasswordChangeFormProps {
  passwords: PasswordFormData;
  loading: boolean;
  onFieldChange: (field: keyof PasswordFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  passwords,
  loading,
  onFieldChange,
  onSubmit,
}) => {
  return (
    <div className="p-8 max-w-lg mx-auto">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
        <i className="fas fa-key mr-3 text-blue-600"></i> Thay đổi mật khẩu
      </h3>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={passwords.current}
            onChange={(e) => onFieldChange('current', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <hr className="border-slate-100" />
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
          <input
            type="password"
            value={passwords.next}
            onChange={(e) => onFieldChange('next', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) => onFieldChange('confirm', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
          >
            {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  );
};
