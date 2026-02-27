import React from 'react';
import { User } from '@/types';
import { ProfileFormData } from '../types';

interface ProfileInfoFormProps {
  user: User;
  formData: ProfileFormData;
  loading: boolean;
  onFieldChange: (field: keyof ProfileFormData, value: string) => void;
  onAvatarChange: (avatar: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  user,
  formData,
  loading,
  onFieldChange,
  onAvatarChange,
  onSubmit,
}) => {
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (re) => {
        onAvatarChange(re.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group cursor-pointer">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-40 h-40 rounded-full border-4 border-slate-100 group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fas fa-camera text-2xl text-white"></i>
            </div>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="text-center">
            <h4 className="font-bold text-slate-900">{user.fullName}</h4>
            <p className="text-sm text-slate-500">
              @{user.username} • {user.role}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
              <input
                value={formData.fullName}
                onChange={(e) => onFieldChange('fullName', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input
                value={formData.phone}
                onChange={(e) => onFieldChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Vai trò (Không thể thay đổi)
              </label>
              <input
                disabled
                value={user.role}
                className="w-full px-4 py-2 border border-slate-200 bg-slate-50 text-slate-400 rounded-lg cursor-not-allowed"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-save mr-2"></i>
              )}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
