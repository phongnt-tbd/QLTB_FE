
import React, { useState } from 'react';
import { UserRole, PermissionConfig, SystemConfig, User } from '@/shared/types';
import { INITIAL_PERMISSIONS, INITIAL_SYSTEM_CONFIG } from '@/shared/constants';
import UserManagement from './UserManagement';

interface SystemSettingsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ users, setUsers }) => {
  const [permissions, setPermissions] = useState<PermissionConfig[]>(INITIAL_PERMISSIONS);
  const [sysConfig, setSysConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [activeTab, setActiveTab] = useState<'rbac' | 'system' | 'users'>('rbac');

  const handlePermissionToggle = (role: UserRole, key: keyof PermissionConfig['permissions']) => {
    setPermissions(prev => prev.map(p => {
      if (p.role === role) {
        return { ...p, permissions: { ...p.permissions, [key]: !p.permissions[key] } };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex bg-white p-1.5 shadow-sm border border-slate-200 rounded-[1.5rem] max-w-2xl">
        <button
          onClick={() => setActiveTab('rbac')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'rbac' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fas fa-user-shield mr-2"></i> Phân quyền
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fas fa-users-cog mr-2"></i> Người dùng
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'system' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fas fa-sliders-h mr-2"></i> Tham số
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'rbac' && (
          <div className="p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center tracking-tight">
              <i className="fas fa-user-shield mr-3 text-blue-600"></i> Quản lý Quyền theo Vai trò (RBAC)
            </h3>
            <div className="overflow-x-auto border border-slate-100 rounded-[2rem]">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Chức năng hệ thống</th>
                    {permissions.map(p => (
                      <th key={p.role} className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.keys(permissions[0].permissions).map((permKey) => (
                    <tr key={permKey} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-700 capitalize">
                        {permKey.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      {permissions.map(p => {
                        const isChecked = p.permissions[permKey as keyof PermissionConfig['permissions']];
                        const isDisabled = p.role === UserRole.SYSTEM_ADMIN;
                        return (
                          <td key={p.role} className="px-8 py-5 whitespace-nowrap text-center">
                            <label className={`relative inline-flex items-center ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isDisabled}
                                onChange={() => handlePermissionToggle(p.role, permKey as keyof PermissionConfig['permissions'])}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-10 flex justify-end">
              <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs">
                Cập nhật cấu hình quyền
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="p-4 md:p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center tracking-tight px-4 md:px-0">
              <i className="fas fa-users-cog mr-3 text-indigo-600"></i> Quản lý Nhân sự & Tài khoản
            </h3>
            <UserManagement users={users} setUsers={setUsers} />
          </div>
        )}

        {activeTab === 'system' && (
          <div className="p-10">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center tracking-tight">
              <i className="fas fa-sliders-h mr-3 text-blue-600"></i> Tham số & Cảnh báo vận hành
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                    <i className="fas fa-bell mr-2"></i> Thông báo & Cảnh báo
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">Thông báo Email khi có bảo trì</span>
                      <input
                        type="checkbox"
                        checked={sysConfig.notificationsEnabled}
                        onChange={(e) => setSysConfig({...sysConfig, notificationsEnabled: e.target.checked})}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Ngưỡng cảnh báo tồn kho thấp</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={sysConfig.alertThreshold}
                          onChange={(e) => setSysConfig({...sysConfig, alertThreshold: parseInt(e.target.value)})}
                          className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-black transition-all"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">Thiết bị</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                    <i className="fas fa-database mr-2"></i> Dữ liệu & Bảo trì
                  </h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">Tự động sao lưu hàng tuần</span>
                      <input
                        type="checkbox"
                        checked={sysConfig.autoBackup}
                        onChange={(e) => setSysConfig({...sysConfig, autoBackup: e.target.checked})}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Chu kỳ bảo trì định kỳ</label>
                      <select
                        value={sysConfig.maintenanceInterval}
                        onChange={(e) => setSysConfig({...sysConfig, maintenanceInterval: parseInt(e.target.value)})}
                        className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-black transition-all cursor-pointer"
                      >
                        <option value={7}>7 ngày (Hàng tuần)</option>
                        <option value={30}>30 ngày (Hàng tháng)</option>
                        <option value={90}>90 ngày (Hàng quý)</option>
                        <option value={180}>180 ngày (Nửa năm)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-end pt-10 border-t border-slate-100">
               <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest text-xs">
                Lưu cấu hình hệ thống
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
