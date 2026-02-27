
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole, Asset, Department, Supplier, AssetCategory } from '@/types';
import {
  INITIAL_USERS,
  INITIAL_ASSETS,
  INITIAL_DEPARTMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_CATEGORIES,
} from '@/constants';
import { userService } from '@/services/userService';
import { UserManagementPage } from '@/features/users/pages/UserManagementPage';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import SystemSettings from '@/pages/SystemSettings';
import AssetManagement from '@/pages/AssetManagement';
import DepartmentManagement from '@/pages/DepartmentManagement';
import SupplierManagement from '@/pages/SupplierManagement';
import CategoryManagement from '@/pages/CategoryManagement';
import AssetDetail from '@/pages/AssetDetail';
import TransferManagement from '@/pages/TransferManagement';
import MaintenanceManagement from '@/pages/MaintenanceManagement';
import AllocationManagement from '@/pages/AllocationManagement';
import RetiredAssets from '@/pages/RetiredAssets';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('uniasset_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('uniasset_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [categories, setCategories] = useState<AssetCategory[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    const savedUser = localStorage.getItem('uniasset_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('uniasset_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('uniasset_users_list', JSON.stringify(users));
  }, [users]);

  const handleCreateUser = (
    input: Omit<User, 'id' | 'avatar' | 'createdAt' | 'isLocked'>,
  ) => {
    setUsers(prev => [...prev, userService.createUser(input)]);
  };

  const handleUpdateUser = (userId: string, patch: Partial<User>) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? userService.updateUser(u, patch) : u)),
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleToggleUserLock = (userId: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? userService.toggleLock(u) : u)),
    );
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    setTimeout(() => {
      const user = users.find(u => u.username === username || u.email === username);
      if (!user) {
        setError('Tài khoản không tồn tại trên hệ thống.');
      } else if (user.isLocked) {
        setError('Tài khoản này hiện đang bị khóa.');
      } else if (password === 'password' || username === 'admin') {
        setCurrentUser(user);
        localStorage.setItem('uniasset_user', JSON.stringify(user));
      } else {
        setError('Mật khẩu không chính xác. Vui lòng thử lại.');
      }
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('uniasset_user');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] px-4 md:px-6 py-10 font-sans">
        <div className="max-w-[1000px] w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col md:flex-row overflow-hidden min-h-[600px]">

          <div className="w-full md:w-[45%] bg-[#1e51a4] p-10 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-[#1a468d]/50">
                  <img src="https://tbd.edu.vn/wp-content/uploads/2024/05/cropped-favicon-192x192.png" alt="TBD Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-black tracking-tight uppercase">TBD SIS</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black leading-[1.1] mb-6 tracking-tight">
                Hệ thống Quản lý <br /> Trang thiết bị
              </h1>
              <p className="text-white/70 text-sm font-medium leading-relaxed max-w-[320px]">
                Giải pháp tập trung quản lý toàn diện vòng đời tài sản, trang thiết bị và cơ sở hạ tầng mạng lưới giáo dục hiện đại tại Đại học Thái Bình Dương.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4 mt-12 md:mt-0">
              <div className="space-y-1">
                <p className="text-2xl font-black">20+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-tight">Phòng ban</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black">5000+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-tight">Thiết bị</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black">99.9%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 leading-tight">Hoạt động</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[55%] p-10 md:p-16 flex flex-col justify-center bg-white relative">
            <div className="max-w-[380px] mx-auto w-full">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Chào mừng trở lại!</h2>
                <p className="text-sm font-medium text-slate-400">Vui lòng đăng nhập bằng tài khoản nội bộ để tiếp tục</p>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl text-xs font-bold text-red-700 animate-in fade-in slide-in-from-top-2">
                  <i className="fas fa-exclamation-circle mr-2 text-red-500"></i> {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Email công vụ</label>
                  <div className="relative">
                    <i className="far fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      name="username"
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 font-bold text-sm transition-all text-slate-700"
                      placeholder="vana.edu@tbd.edu.vn"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                    <a href="#" className="text-[9px] font-black text-slate-300 uppercase hover:text-blue-600 transition-colors tracking-widest">Quên mật khẩu?</a>
                  </div>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-[#f8fafc] border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 font-bold text-sm transition-all text-slate-700"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-4 bg-[#1e51a4] text-white font-black rounded-2xl shadow-xl shadow-blue-900/10 hover:bg-[#1a468d] hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group mt-8"
                >
                  {isLoggingIn ? (
                    <i className="fas fa-circle-notch fa-spin"></i>
                  ) : (
                    <>
                      <span>Đăng nhập hệ thống</span>
                      <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-16 text-center">
                <p className="text-[10px] font-bold text-slate-300 italic tracking-wider">
                  Bảo mật bởi TBD Security Cloud. Phiên bản v2.5.4
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout user={currentUser} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard assets={assets} />} />
          <Route path="/assets" element={<AssetManagement assets={assets} setAssets={setAssets} departments={departments} suppliers={suppliers} categories={categories} />} />
          <Route path="/assets/:id" element={<AssetDetail assets={assets} setAssets={setAssets} departments={departments} suppliers={suppliers} user={currentUser} />} />
          <Route path="/allocations" element={<AllocationManagement assets={assets} setAssets={setAssets} departments={departments} user={currentUser} />} />
          <Route path="/maintenance" element={<MaintenanceManagement assets={assets} setAssets={setAssets} departments={departments} user={currentUser} />} />
          <Route path="/transfers" element={<TransferManagement role={currentUser.role} assets={assets} setAssets={setAssets} departments={departments} user={currentUser} />} />
          <Route path="/retired" element={<RetiredAssets assets={assets} />} />
          <Route path="/units" element={<DepartmentManagement departments={departments} setDepartments={setDepartments} />} />
          <Route path="/suppliers" element={<SupplierManagement suppliers={suppliers} setSuppliers={setSuppliers} assets={assets} />} />
          <Route path="/categories" element={<CategoryManagement categories={categories} setCategories={setCategories} assets={assets} />} />
          <Route
            path="/settings"
            element={
              <SystemSettings
                users={users}
                renderUserManagement={({ users: settingsUsers }) => (
                  <UserManagementPage
                    users={settingsUsers}
                    onCreateUser={handleCreateUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                    onToggleUserLock={handleToggleUserLock}
                  />
                )}
              />
            }
          />
          <Route path="/profile" element={<Profile user={currentUser} onUpdate={u => {
            setCurrentUser(u);
            setUsers(prev => prev.map(usr => usr.id === u.id ? u : usr));
          }} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
