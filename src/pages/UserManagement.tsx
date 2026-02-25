
import React, { useState } from 'react';
import { User, UserRole } from '@/shared/types';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLock = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isLocked: !u.isLocked } : u));
  };

  const deleteUser = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const resetPassword = (username: string) => {
    alert(`Mật khẩu của người dùng ${username} đã được reset về mặc định: password`);
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData: User = {
      id: editingUser?.id || Math.random().toString(36).substr(2, 9),
      username: formData.get('username') as string,
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as UserRole,
      avatar: editingUser?.avatar || `https://picsum.photos/seed/${formData.get('username')}/200`,
      isLocked: editingUser?.isLocked || false,
      createdAt: editingUser?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? userData : u));
    } else {
      setUsers(prev => [...prev, userData]);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div className="relative w-full sm:w-96">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <i className="fas fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, username..."
            className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all uppercase tracking-widest"
        >
          <i className="fas fa-plus mr-2"></i> Thêm người dùng
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người dùng</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Liên hệ</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vai trò</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-11 w-11 rounded-2xl border border-slate-100" src={user.avatar} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-black text-slate-900 leading-tight">{user.fullName}</div>
                        <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-700">{user.email}</div>
                    <div className="text-[10px] text-slate-400 font-bold">{user.phone}</div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm
                      ${user.role === UserRole.SYSTEM_ADMIN ? 'bg-indigo-100 text-indigo-700' :
                        user.role === UserRole.ASSET_MANAGER ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <span className={`px-3 py-1.5 inline-flex text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm ${user.isLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {user.isLocked ? 'Bị khóa' : 'Hoạt động'}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingUser(user); setIsModalOpen(true); }} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" title="Sửa"><i className="fas fa-edit"></i></button>
                      <button onClick={() => toggleLock(user.id)} className={`w-10 h-10 flex items-center justify-center bg-white border border-slate-200 ${user.isLocked ? 'text-green-600 hover:bg-green-600' : 'text-amber-600 hover:bg-amber-600'} hover:text-white rounded-xl transition-all shadow-sm`} title={user.isLocked ? 'Mở khóa' : 'Khóa'}>
                        <i className={`fas ${user.isLocked ? 'fa-unlock' : 'fa-lock'}`}></i>
                      </button>
                      <button onClick={() => resetPassword(user.username)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-xl transition-all shadow-sm" title="Reset Mật khẩu"><i className="fas fa-key"></i></button>
                      <button onClick={() => deleteUser(user.id)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm" title="Xóa"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] max-w-md w-full p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center tracking-tight">
              <i className={`fas ${editingUser ? 'fa-user-edit' : 'fa-user-plus'} mr-3 text-blue-600`}></i>
              {editingUser ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới'}
            </h3>
            <form onSubmit={handleSaveUser} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên đăng nhập</label>
                <input name="username" defaultValue={editingUser?.username} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all" placeholder="Ví dụ: nva_it" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                <input name="fullName" defaultValue={editingUser?.fullName} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all" placeholder="Ví dụ: Nguyễn Văn A" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" name="email" defaultValue={editingUser?.email} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all" placeholder="example@uni.edu.vn" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <input name="phone" defaultValue={editingUser?.phone} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all" placeholder="09xxxxxxx" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vai trò hệ thống</label>
                <select name="role" defaultValue={editingUser?.role || UserRole.TECHNICIAN} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none cursor-pointer">
                  {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="mt-8 flex gap-4">
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">Lưu thông tin</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
