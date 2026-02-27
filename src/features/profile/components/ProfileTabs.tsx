import React from 'react';
import { ProfileTab } from '../types';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white p-1 shadow-sm border border-slate-200 rounded-xl flex">
      <button
        onClick={() => onTabChange('info')}
        className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
          activeTab === 'info'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <i className="fas fa-user-circle mr-2"></i> Thông tin cá nhân
      </button>
      <button
        onClick={() => onTabChange('password')}
        className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
          activeTab === 'password'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <i className="fas fa-shield-alt mr-2"></i> Bảo mật & Mật khẩu
      </button>
    </div>
  );
};
