
import React from 'react';
import { Asset, AssetItemStatus } from '@/types';

interface DashboardProps {
  assets: Asset[];
}

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  const totalItems = assets.reduce((sum, a) => sum + a.totalQuantity, 0);
  const inStock = assets.reduce((sum, a) => sum + a.items.filter(i => i.status === AssetItemStatus.IN_STOCK).length, 0);
  const maintenanceCount = assets.reduce((sum, a) => sum + a.items.filter(i => i.status === AssetItemStatus.MAINTENANCE).length, 0);
  const damagedCount = assets.reduce((sum, a) => sum + a.items.filter(i => i.status === AssetItemStatus.DAMAGED).length, 0);
  const allocated = assets.reduce((sum, a) => sum + a.items.filter(i => i.status === AssetItemStatus.ALLOCATED).length, 0);

  const stats = [
    { label: 'Tổng số tài sản', value: totalItems.toLocaleString(), icon: 'fa-desktop', color: 'bg-blue-500' },
    { label: 'Đang phân bổ', value: allocated.toLocaleString(), icon: 'fa-check-circle', color: 'bg-green-500' },
    { label: 'Hỏng & Bảo trì', value: (maintenanceCount + damagedCount).toLocaleString(), icon: 'fa-tools', color: 'bg-amber-500' },
    { label: 'Tồn kho trung tâm', value: inStock.toLocaleString(), icon: 'fa-warehouse', color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <i className={`fas ${stat.icon} text-xl`}></i>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thống kê</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 mb-8 flex items-center text-lg uppercase tracking-widest">
            <i className="fas fa-history mr-3 text-blue-600"></i> Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            {assets.slice(0, 5).map((asset, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                  <i className="fas fa-sync-alt"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 font-black">Cập nhật lô tài sản: {asset.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Mã lô {asset.batchCode} • {asset.purchaseDate}</p>
                </div>
                <span className="text-[10px] font-black px-3 py-1 bg-green-50 text-green-700 rounded-lg uppercase tracking-widest">Đã nhập kho</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 mb-8 flex items-center text-lg uppercase tracking-widest">
            <i className="fas fa-bell mr-3 text-red-600"></i> Thông báo
          </h3>
          <div className="space-y-4">
            {(maintenanceCount > 0 || damagedCount > 0) && (
              <div className="p-5 bg-amber-50 border border-amber-100 rounded-[2rem]">
                <p className="text-sm text-amber-900 font-black">Tài sản lỗi & bảo trì</p>
                <p className="text-xs text-amber-700 mt-2 font-medium leading-relaxed">
                  Có {damagedCount} tài sản báo hỏng và {maintenanceCount} tài sản đang bảo trì. Vui lòng kiểm tra trang Hỏng & Thanh lý.
                </p>
              </div>
            )}
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem]">
              <p className="text-sm text-slate-800 font-black">Nhắc nhở hệ thống</p>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Đã đến kỳ kiểm kê tài sản định kỳ quý 4. Vui lòng chuẩn bị báo cáo trước ngày 30/11.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
