
import React, { useMemo, useState } from 'react';
import { Asset, AssetItemStatus, LifecycleEvent } from '@/types';
import { Link } from 'react-router-dom';

interface RetiredAssetsProps {
  assets: Asset[];
}

const RetiredAssets: React.FC<RetiredAssetsProps> = ({ assets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'damaged' | 'retired'>('damaged');

  const itemsData = useMemo(() => {
    const damaged: { item: any; asset: Asset; event: LifecycleEvent | undefined }[] = [];
    const retired: { item: any; asset: Asset; event: LifecycleEvent | undefined }[] = [];

    assets.forEach(asset => {
      asset.items.forEach(i => {
        if (i.status === AssetItemStatus.DAMAGED) {
          const event = [...asset.history].reverse().find(h =>
            h.description.includes('Báo hỏng') && (h.description.includes(i.assetCode) || asset.items.length === 1)
          );
          damaged.push({ item: i, asset, event });
        } else if (i.status === AssetItemStatus.RETIRED) {
          const event = [...asset.history].reverse().find(h =>
            h.type === 'Retire' && (h.description.includes(i.assetCode) || asset.items.length === 1)
          );
          retired.push({ item: i, asset, event });
        }
      });
    });

    return { damaged, retired };
  }, [assets]);

  const displayItems = activeTab === 'damaged' ? itemsData.damaged : itemsData.retired;

  const filteredItems = displayItems.filter(di =>
    di.item.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    di.asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center text-2xl shadow-inner ${activeTab === 'damaged' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
            <i className={`fas ${activeTab === 'damaged' ? 'fa-exclamation-triangle' : 'fa-dumpster'}`}></i>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hỏng & Thanh lý</h2>
            <p className="text-sm text-slate-500 font-medium text-[10px] uppercase tracking-wider">Hệ thống quản lý tài sản ngưng hoạt động</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-[1.8rem] w-full md:w-auto">
          <button
            onClick={() => setActiveTab('damaged')}
            className={`flex-1 md:px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'damaged' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-tools"></i> Báo hỏng ({itemsData.damaged.length})
          </button>
          <button
            onClick={() => setActiveTab('retired')}
            className={`flex-1 md:px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'retired' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-trash-alt"></i> Thanh lý ({itemsData.retired.length})
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div className="relative mb-6">
          <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            placeholder={`Tìm trong danh sách ${activeTab === 'damaged' ? 'tài sản hỏng' : 'tài sản thanh lý'}...`}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-inner">
          <table className="min-w-full divide-y divide-slate-100 text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tài sản & Mã định danh</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{activeTab === 'damaged' ? 'Ngày báo hỏng' : 'Ngày thanh lý'}</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lý do ghi nhận</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người thực hiện</th>
                <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map(({ item, asset, event }) => (
                <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors group ${activeTab === 'damaged' ? 'hover:bg-orange-50/10' : 'hover:bg-red-50/10'}`}>
                  <td className="px-8 py-5">
                    <div className="font-black text-slate-900 text-sm leading-tight">{asset.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${activeTab === 'damaged' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
                          {item.assetCode}
                       </span>
                       <span className="text-[9px] font-black text-slate-400 uppercase">{asset.category}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                      {event?.date || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-[11px] text-slate-600 font-medium italic max-w-xs line-clamp-2">
                      {event?.description.split('Lý do: ')[1] || 'Hỏng hóc/Cần kiểm tra'}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] text-slate-500 font-black uppercase">
                          {event?.performedBy?.charAt(0) || 'A'}
                       </div>
                       <span className="text-xs font-bold text-slate-700">{event?.performedBy || 'Quản trị viên'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {event?.pdfUrl && (
                         <button className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${activeTab === 'damaged' ? 'bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}>
                            <i className="fas fa-file-pdf text-xs"></i>
                         </button>
                       )}
                       <Link
                        to={`/assets/${item.id}`}
                        className="w-9 h-9 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"
                       >
                          <i className="fas fa-history text-xs"></i>
                       </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">
                    <div className="flex flex-col items-center gap-4">
                       <i className={`fas ${activeTab === 'damaged' ? 'fa-check-circle text-green-200' : 'fa-box-open text-slate-200'} text-4xl`}></i>
                       <span>{activeTab === 'damaged' ? 'Tuyệt vời! Không có tài sản nào đang báo hỏng.' : 'Danh sách thanh lý hiện đang trống.'}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RetiredAssets;
