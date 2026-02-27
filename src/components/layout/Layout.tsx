
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

interface MenuItem {
  path?: string;
  label: string;
  icon: string;
  roles: UserRole[];
  children?: MenuItem[];
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isManagementExpanded, setIsManagementExpanded] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const managementPaths = ['/', '/assets', '/allocations', '/categories', '/maintenance', '/transfers', '/units', '/suppliers', '/retired'];
    if (managementPaths.some(path => location.pathname === path || (path !== '/' && location.pathname.startsWith(path)))) {
      setIsManagementExpanded(true);
    }
  }, [location.pathname]);

  if (!user) return <>{children}</>;

  const menuConfig: MenuItem[] = [
    {
      label: 'Quản trị thiết bị',
      icon: 'fa-microchip',
      roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER, UserRole.TECHNICIAN],
      children: [
        { path: '/', label: 'Dashboard', icon: 'fa-chart-pie', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER, UserRole.TECHNICIAN] },
        { path: '/assets', label: 'Tài sản & Kho', icon: 'fa-box-open', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER] },
        { path: '/allocations', label: 'Cấp phát - Thu hồi', icon: 'fa-hand-holding-medical', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER] },
        { path: '/categories', label: 'Danh mục tài sản', icon: 'fa-tags', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER] },
        { path: '/maintenance', label: 'Sửa chữa & Bảo trì', icon: 'fa-tools', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER, UserRole.TECHNICIAN] },
        { path: '/transfers', label: 'Điều chuyển', icon: 'fa-exchange-alt', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER] },
        { path: '/retired', label: 'Hỏng & Thanh lý', icon: 'fa-dumpster', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER] },
        { path: '/units', label: 'Quản lý Đơn vị', icon: 'fa-building', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER] },
        { path: '/suppliers', label: 'Nhà cung cấp', icon: 'fa-truck', roles: [UserRole.SYSTEM_ADMIN] },
      ]
    },
    { path: '/settings', label: 'Cài đặt hệ thống', icon: 'fa-cog', roles: [UserRole.SYSTEM_ADMIN] },
    { path: '/profile', label: 'Cá nhân', icon: 'fa-user-circle', roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER, UserRole.TECHNICIAN] },
  ];

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    const hasRoles = item.roles.includes(user.role);
    if (!hasRoles) return null;

    const isActive = item.path === location.pathname || (item.path !== '/' && item.path && location.pathname.startsWith(item.path));
    const isParentOfActive = item.children?.some(child => child.path === location.pathname || (child.path !== '/' && child.path && location.pathname.startsWith(child.path)));

    if (item.children) {
      return (
        <div key={item.label} className="mb-1">
          <button
            onClick={() => {
              if (!isSidebarOpen) setSidebarOpen(true);
              setIsManagementExpanded(!isManagementExpanded);
            }}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${isParentOfActive ? 'text-blue-500 font-black' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <div className="flex items-center">
              <i className={`fas ${item.icon} w-6 text-center text-lg`}></i>
              {isSidebarOpen && <span className="ml-3 font-bold text-sm tracking-tight">{item.label}</span>}
            </div>
            {isSidebarOpen && (
              <i className={`fas fa-chevron-down text-[10px] transition-transform duration-300 ${isManagementExpanded ? 'rotate-180' : ''}`}></i>
            )}
          </button>

          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isManagementExpanded && isSidebarOpen ? 'max-h-[600px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
            <div className="ml-6 border-l border-slate-800 pl-2 space-y-1">
              {item.children.map(child => renderMenuItem(child, true))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path!}
        className={`flex items-center px-4 py-3 rounded-2xl transition-all mb-1 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
      >
        <i className={`fas ${item.icon} w-6 text-center ${isChild ? 'text-sm' : 'text-lg'}`}></i>
        {isSidebarOpen && <span className={`ml-3 font-bold tracking-tight ${isChild ? 'text-[13px]' : 'text-sm'}`}>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed inset-y-0 z-50 shadow-2xl`}>
        <div className="p-4 flex items-center justify-between border-b border-slate-800 h-20 shrink-0">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg">
                <img src="https://tbd.edu.vn/wp-content/uploads/2024/05/cropped-favicon-192x192.png" alt="TBD Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">TBD</span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg mx-auto">
              <img src="https://tbd.edu.vn/wp-content/uploads/2024/05/cropped-favicon-192x192.png" alt="TBD Logo" className="w-full h-full object-contain" />
            </div>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 absolute -right-3 top-20 bg-slate-900 border border-slate-800 rounded-full w-6 h-6 flex items-center justify-center z-50">
            <i className={`fas fa-angle-${isSidebarOpen ? 'left' : 'right'} text-[10px]`}></i>
          </button>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto px-3 custom-scrollbar">
          {menuConfig.map(item => renderMenuItem(item))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <button onClick={onLogout} className="flex items-center w-full p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group">
            <i className="fas fa-sign-out-alt w-6 text-center group-hover:scale-110 transition-transform"></i>
            {isSidebarOpen && <span className="ml-3 font-black text-[10px] uppercase tracking-widest">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
            Hệ thống Quản lý Trang thiết bị
          </h2>
          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-900">{user.fullName}</p>
              <span className="text-[10px] font-black px-3 py-1 bg-blue-50 text-blue-600 rounded-full uppercase tracking-widest border border-blue-100">{user.role}</span>
            </div>
            <div className="relative group">
              <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-slate-100 shadow-sm cursor-pointer group-hover:border-blue-500 transition-all" alt="" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </div>
  );
};

export default Layout;
