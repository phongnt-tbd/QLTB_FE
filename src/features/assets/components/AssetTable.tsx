import React from 'react';
import { Link } from 'react-router-dom';
import { AssetWithParent } from '../types';
import { AssetItemStatus, Department, AssetCategory } from '@/types';

interface AssetTableProps {
  items: AssetWithParent[];
  selectedIds: string[];
  departments: Department[];
  categories: AssetCategory[];
  onToggleSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onActionClick: (id: string, action: 'allocate' | 'recover' | 'transfer' | 'maintenance' | 'retire' | 'damage') => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  items,
  selectedIds,
  departments,
  categories,
  onToggleSelect,
  onSelectAll,
  onActionClick,
}) => {
  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const getStatusBadgeClass = (status: AssetItemStatus): string => {
    const baseClass = 'px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm';
    
    switch (status) {
      case AssetItemStatus.IN_STOCK:
        return `${baseClass} bg-green-100 text-green-700`;
      case AssetItemStatus.ALLOCATED:
        return `${baseClass} bg-blue-100 text-blue-700`;
      case AssetItemStatus.DAMAGED:
        return `${baseClass} bg-orange-100 text-orange-700`;
      case AssetItemStatus.MAINTENANCE:
        return `${baseClass} bg-amber-100 text-amber-700`;
      case AssetItemStatus.RETIRED:
        return `${baseClass} bg-red-100 text-red-700`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700`;
    }
  };

  const getStatusDotClass = (status: AssetItemStatus): string => {
    const baseClass = 'w-1.5 h-1.5 rounded-full';
    
    switch (status) {
      case AssetItemStatus.IN_STOCK:
        return `${baseClass} bg-green-500`;
      case AssetItemStatus.ALLOCATED:
        return `${baseClass} bg-blue-500`;
      case AssetItemStatus.DAMAGED:
        return `${baseClass} bg-orange-500`;
      case AssetItemStatus.MAINTENANCE:
        return `${baseClass} bg-amber-500`;
      case AssetItemStatus.RETIRED:
        return `${baseClass} bg-red-500`;
      default:
        return `${baseClass} bg-gray-500`;
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-6 w-10">
                <input
                  type="checkbox"
                  onChange={(e) => onSelectAll(e.target.checked)}
                  checked={allSelected}
                  className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Mã tài sản
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tên & Phân loại
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Đơn vị / Vị trí
              </th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50 transition-colors group ${
                  selectedIds.includes(item.id) ? 'bg-blue-50/30' : ''
                }`}
              >
                <td className="px-8 py-6">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                    className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="px-8 py-6">
                  <span className="font-mono font-bold text-blue-600 text-[11px] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 shadow-sm">
                    {item.assetCode}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div>
                    <Link
                      to={`/assets/${item.id}`}
                      className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors block leading-tight"
                    >
                      {item.parentBatch.name}
                      <i className="fas fa-external-link-alt text-[8px] ml-1.5 opacity-0 group-hover:opacity-40 transition-opacity"></i>
                    </Link>
                    <div className="flex items-center gap-1.5 mt-1">
                      <i
                        className={`fas ${
                          categories.find((c) => c.name === item.parentBatch.category)?.icon || 'fa-tag'
                        } text-[8px] text-slate-400`}
                      ></i>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {item.parentBatch.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={getStatusBadgeClass(item.status)}>
                    <span className={getStatusDotClass(item.status)}></span>
                    {item.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    {item.currentDeptId ? (
                      <div className="flex items-center">
                        <i className="fas fa-building text-slate-300 text-xs mr-2"></i>
                        {departments.find((d) => d.id === item.currentDeptId)?.name}
                      </div>
                    ) : (
                      <span className="text-slate-300 italic font-medium">
                        {item.status === AssetItemStatus.RETIRED ? 'Khu vực thanh lý' : 'Kho trung tâm'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.status === AssetItemStatus.IN_STOCK && (
                      <>
                        <button
                          onClick={() => onActionClick(item.id, 'allocate')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Cấp phát"
                        >
                          <i className="fas fa-paper-plane text-xs"></i>
                        </button>
                        <button
                          onClick={() => onActionClick(item.id, 'damage')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Báo hỏng"
                        >
                          <i className="fas fa-exclamation-triangle text-xs"></i>
                        </button>
                      </>
                    )}

                    {item.status === AssetItemStatus.ALLOCATED && (
                      <>
                        <button
                          onClick={() => onActionClick(item.id, 'damage')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-orange-500 hover:bg-orange-500 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Báo hỏng"
                        >
                          <i className="fas fa-exclamation-triangle text-xs"></i>
                        </button>
                        <button
                          onClick={() => onActionClick(item.id, 'recover')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Thu hồi"
                        >
                          <i className="fas fa-undo text-xs"></i>
                        </button>
                        <button
                          onClick={() => onActionClick(item.id, 'transfer')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shadow-sm"
                          title="Điều chuyển"
                        >
                          <i className="fas fa-exchange-alt text-xs"></i>
                        </button>
                      </>
                    )}

                    {item.status !== AssetItemStatus.MAINTENANCE && item.status !== AssetItemStatus.RETIRED && (
                      <button
                        onClick={() => onActionClick(item.id, 'maintenance')}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Gửi sửa chữa"
                      >
                        <i className="fas fa-tools text-xs"></i>
                      </button>
                    )}

                    {item.status !== AssetItemStatus.RETIRED && item.status !== AssetItemStatus.MAINTENANCE && (
                      <button
                        onClick={() => onActionClick(item.id, 'retire')}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"
                        title="Thanh lý"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
