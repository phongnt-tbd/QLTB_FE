
import React, { useMemo, useState } from 'react';
import { Asset, AssetItemStatus, Department, User, LifecycleEvent } from '@/types';
import { Link } from 'react-router-dom';

interface MaintenanceManagementProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  departments: Department[];
  user: User;
}

const MaintenanceManagement: React.FC<MaintenanceManagementProps> = ({ assets, setAssets, departments, user }) => {
  const [selectedTask, setSelectedTask] = useState<{ item: any, asset: Asset } | null>(null);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const maintenanceItems = useMemo(() => {
    const items: { item: any, asset: Asset }[] = [];
    assets.forEach(asset => {
      asset.items.forEach(i => {
        if (i.status === AssetItemStatus.MAINTENANCE) {
          items.push({ item: i, asset });
        }
      });
    });
    return items;
  }, [assets]);

  const handleFinishMaintenance = () => {
    if (!selectedTask) return;

    setAssets(prev => prev.map(a => {
      if (a.id === selectedTask.asset.id) {
        const updatedItems = a.items.map(i => {
          if (i.id === selectedTask.item.id) {
            const wasAllocated = !!i.currentDeptId;
            return { 
              ...i, 
              status: wasAllocated ? AssetItemStatus.ALLOCATED : AssetItemStatus.IN_STOCK 
            };
          }
          return i;
        });

        const lastMaintenance = [...selectedTask.asset.history].reverse().find(h => h.type === 'Maintenance' && h.provider);

        const newHistory: LifecycleEvent = {
          id: `h-maint-fin-${Date.now()}`,
          assetId: a.id,
          type: 'Maintenance',
          date: new Date().toISOString().split('T')[0],
          description: `Nghiệm thu hoàn tất sửa chữa tài sản mã ${selectedTask.item.assetCode}. Tài sản đã khôi phục trạng thái hoạt động.`,
          performedBy: user.fullName,
          cost: lastMaintenance?.cost || 0
        };

        return { ...a, items: updatedItems, history: [newHistory, ...a.history] };
      }
      return a;
    }));

    setIsFinishModalOpen(false);
    setSelectedTask(null);
    alert('Đã xác nhận nghiệm thu. Tài sản đã quay lại trạng thái hoạt động.');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sửa chữa & Bảo trì</h2>
          <p className="text-sm text-slate-500 font-medium text-[10px] uppercase tracking-wider">Hệ thống nghiệm thu tập trung toàn trường</p>
        </div>
        <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center gap-3">
          <i className="fas fa-tools text-amber-600 animate-bounce"></i>
          <span className="text-amber-700 font-black text-sm uppercase tracking-widest">Đang chờ xử lý: {maintenanceItems.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài sản / Lô</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã định danh</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Đơn vị sửa chữa</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lý do sửa chữa</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chi phí dự kiến</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nơi trả máy</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {maintenanceItems.map(({ item, asset }) => {
                const lastMaintenance = [...asset.history].reverse().find(h => h.type === 'Maintenance' && h.provider);
                const returnTarget = item.currentDeptId ? departments.find(d => d.id === item.currentDeptId)?.name : 'Kho trung tâm';
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-900 text-sm">{asset.name}</div>
                      <div className="text-[10px] text-blue-500 font-mono font-bold tracking-tight uppercase">{asset.batchCode}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-mono font-bold text-slate-600 text-xs bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 shadow-sm">{item.assetCode}</span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                          <i className="fas fa-truck-pickup text-xs"></i>
                        </div>
                        <span className="text-xs font-black text-slate-700 line-clamp-1">{lastMaintenance?.provider || 'Chưa xác định'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-[11px] text-slate-600 font-medium italic max-w-[200px] line-clamp-2 leading-relaxed">
                        "{lastMaintenance?.description?.split('. Nội dung: ')[1] || lastMaintenance?.description || 'N/A'}"
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5">
                        <i className="fas fa-coins text-[10px] text-amber-400"></i>
                        <span className="text-xs font-black text-slate-800 tracking-tight">
                          {lastMaintenance?.cost?.toLocaleString() || 0}
                        </span>
                        <span className="text-[9px] font-black text-slate-400">VNĐ</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex flex-col items-center px-3 py-1.5 rounded-xl border ${item.currentDeptId ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                        <span className="text-[9px] font-black uppercase tracking-widest">{item.currentDeptId ? 'Về Đơn vị' : 'Nhập lại Kho'}</span>
                        <p className="text-[10px] font-bold truncate max-w-[120px]">{returnTarget}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedTask({ item, asset }); setIsFinishModalOpen(true); }}
                          className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-green-500/20 flex items-center gap-1.5"
                        >
                          <i className="fas fa-check-double"></i> Nghiệm thu
                        </button>
                        <Link 
                          to={`/assets/${item.id}`}
                          className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
                        >
                          <i className="fas fa-eye text-xs"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {maintenanceItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-slate-400 italic font-medium">
                    <div className="flex flex-col items-center gap-4">
                       <i className="fas fa-coffee text-4xl text-slate-200"></i>
                       <span>Không có tài sản nào đang chờ sửa chữa. Hệ thống sạch sẽ!</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Finish Maintenance Modal */}
      {isFinishModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center mx-auto text-2xl shadow-inner">
              <i className="fas fa-clipboard-check"></i>
            </div>
            
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Xác nhận Nghiệm thu</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">Tài sản <b>{selectedTask.item.assetCode}</b> đã được sửa chữa xong?</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Đơn vị sửa:</span>
                <span className="text-xs font-bold text-slate-700">
                  {([...selectedTask.asset.history].reverse().find(h => h.type === 'Maintenance' && h.provider)?.provider) || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Chi phí:</span>
                <span className="text-xs font-bold text-green-600">
                  {([...selectedTask.asset.history].reverse().find(h => h.type === 'Maintenance' && h.cost)?.cost)?.toLocaleString() || 0} VNĐ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase">Đơn vị nhận máy:</span>
                <span className="text-xs font-bold text-indigo-600">
                  {selectedTask.item.currentDeptId ? departments.find(d => d.id === selectedTask.item.currentDeptId)?.name : 'Kho trung tâm'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleFinishMaintenance}
                className="w-full py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-500/30 hover:bg-green-700 transition-all uppercase text-xs tracking-widest"
              >
                Xác nhận hoàn thành
              </button>
              <button 
                onClick={() => { setIsFinishModalOpen(false); setSelectedTask(null); }} 
                className="w-full py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase text-xs tracking-widest"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceManagement;
