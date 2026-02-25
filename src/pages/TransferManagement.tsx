
import React, { useState, useMemo } from 'react';
import { UserRole, Asset, Department, User, LifecycleEvent, AssetItemStatus } from '@/shared/types';

interface TransferProps {
  role: UserRole;
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  departments: Department[];
  user: User;
}

const TransferManagement: React.FC<TransferProps> = ({ role, assets, setAssets, departments, user }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');

  // Lấy toàn bộ lịch sử điều chuyển từ tất cả các lô tài sản
  const transferHistory = useMemo(() => {
    const history: (LifecycleEvent & { assetName: string, batchCode: string })[] = [];
    assets.forEach(asset => {
      asset.history.forEach(h => {
        if (h.type === 'Transfer' || (h.type === 'Allocation' && h.description.includes('Điều chuyển'))) {
          history.push({ ...h, assetName: asset.name, batchCode: asset.batchCode });
        }
      });
    });
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [assets]);

  const handleDirectTransfer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const assetId = formData.get('assetId') as string;
    const fromDeptId = formData.get('fromDeptId') as string;
    const toDeptId = formData.get('toDeptId') as string;
    const reason = formData.get('reason') as string;
    
    if (fromDeptId === toDeptId) {
      alert('Đơn vị đích phải khác đơn vị hiện tại.');
      return;
    }

    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const fromDeptName = departments.find(d => d.id === fromDeptId)?.name || 'Không xác định';
    const toDeptName = departments.find(d => d.id === toDeptId)?.name || 'Không xác định';

    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        // Cập nhật tất cả các item đang thuộc đơn vị cũ sang đơn vị mới
        const updatedItems = a.items.map(item => {
          if (item.currentDeptId === fromDeptId) {
            return { ...item, currentDeptId: toDeptId };
          }
          return item;
        });

        const newHistory: LifecycleEvent = {
          id: `trans-${Date.now()}`,
          assetId: a.id,
          type: 'Transfer',
          date: new Date().toISOString().split('T')[0],
          description: `Điều chuyển trực tiếp từ ${fromDeptName} sang ${toDeptName}. Lý do: ${reason}`,
          performedBy: user.fullName,
          fromDept: fromDeptName,
          toDept: toDeptName
        };

        return { ...a, items: updatedItems, history: [newHistory, ...a.history] };
      }
      return a;
    }));

    setModalOpen(false);
    alert(`Đã điều chuyển tài sản từ ${fromDeptName} sang ${toDeptName} thành công!`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Điều chuyển trực tiếp</h2>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider text-[10px]">Luân chuyển tài sản tức thì giữa các đơn vị</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)} 
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center"
        >
          <i className="fas fa-exchange-alt mr-2"></i> Thực hiện điều chuyển mới
        </button>
      </div>

      {/* Transfer History Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Lịch sử luân chuyển tài sản</h3>
          <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black">{transferHistory.length} bản ghi</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày thực hiện</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài sản</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lộ trình</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người thực hiện</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nội dung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transferHistory.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">{log.date}</td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900 text-sm">{log.assetName}</div>
                    <div className="text-[10px] text-blue-500 font-mono font-bold tracking-tight uppercase">{log.batchCode}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{log.fromDept || 'N/A'}</span>
                      <i className="fas fa-long-arrow-alt-right text-slate-300"></i>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{log.toDept || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-700">{log.performedBy}</td>
                  <td className="px-8 py-5 text-xs text-slate-500 italic max-w-xs truncate">{log.description}</td>
                </tr>
              ))}
              {transferHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">
                    Chưa có lịch sử điều chuyển nào được ghi nhận.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Transfer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-8">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Điều chuyển tài sản</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hành động này sẽ thay đổi đơn vị sử dụng ngay lập tức</p>
               </div>
               <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form className="space-y-6" onSubmit={handleDirectTransfer}>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chọn Lô tài sản</label>
                <select 
                  name="assetId" 
                  required 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                >
                  <option value="">-- Chọn lô tài sản --</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.batchCode})</option>)}
                </select>
              </div>

              {selectedAssetId && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Từ đơn vị hiện tại</label>
                      <select name="fromDeptId" required className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-bold text-slate-500">
                        {Array.from(new Set(assets.find(a => a.id === selectedAssetId)?.items.map(i => i.currentDeptId).filter(id => id))).map(deptId => (
                          <option key={deptId} value={deptId}>{departments.find(d => d.id === deptId)?.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Đến đơn vị tiếp nhận</label>
                      <select name="toDeptId" required className="w-full px-5 py-3.5 bg-blue-50 border border-blue-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-blue-700 transition-all">
                        <option value="">-- Chọn đơn vị đến --</option>
                        {departments.filter(d => d.id !== 'stock').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lý do điều chuyển cụ thể</label>
                <textarea name="reason" rows={3} required placeholder="Ví dụ: Chuyển giao tài sản phục vụ kỳ thi học kỳ..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"></textarea>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">Xác nhận & Cập nhật ngay</button>
                <button type="button" onClick={() => setModalOpen(false)} className="px-8 py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Hủy bỏ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferManagement;
