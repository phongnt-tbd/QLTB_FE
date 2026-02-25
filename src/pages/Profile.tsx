
import React, { useState } from 'react';
import { User } from '@/shared/types';

interface ProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar
  });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [loading, setLoading] = useState(false);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onUpdate({ ...user, ...formData });
      setLoading(false);
      alert('Cập nhật hồ sơ thành công!');
    }, 800);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setPasswords({ current: '', next: '', confirm: '' });
      setLoading(false);
      alert('Đổi mật khẩu thành công!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-1 shadow-sm border border-slate-200 rounded-xl flex">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === 'info' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <i className="fas fa-user-circle mr-2"></i> Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === 'password' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          <i className="fas fa-shield-alt mr-2"></i> Bảo mật & Mật khẩu
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'info' ? (
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer">
                  <img src={formData.avatar} alt="Avatar" className="w-40 h-40 rounded-full border-4 border-slate-100 group-hover:opacity-75 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-camera text-2xl text-white"></i>
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (re) => setFormData({...formData, avatar: re.target?.result as string});
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-bold text-slate-900">{user.fullName}</h4>
                  <p className="text-sm text-slate-500">@{user.username} • {user.role}</p>
                </div>
              </div>

              <form onSubmit={handleInfoSubmit} className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên</label>
                    <input
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-400 mb-1">Vai trò (Không thể thay đổi)</label>
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
                    {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-8 max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <i className="fas fa-key mr-3 text-blue-600"></i> Thay đổi mật khẩu
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <hr className="border-slate-100" />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
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
        )}
      </div>
    </div>
  );
};

export default Profile;
