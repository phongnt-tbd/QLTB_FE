import React from 'react';

interface AssetActionBarProps {
  selectedCount: number;
  canBulkReportDamage: boolean;
  canBulkAllocate: boolean;
  canBulkRecover: boolean;
  canBulkTransfer: boolean;
  canBulkMaintain: boolean;
  canBulkRetire: boolean;
  onReportDamage: () => void;
  onAllocate: () => void;
  onRecover: () => void;
  onTransfer: () => void;
  onMaintenance: () => void;
  onRetire: () => void;
  onImport: () => void;
}

export const AssetActionBar: React.FC<AssetActionBarProps> = ({
  selectedCount,
  canBulkReportDamage,
  canBulkAllocate,
  canBulkRecover,
  canBulkTransfer,
  canBulkMaintain,
  canBulkRetire,
  onReportDamage,
  onAllocate,
  onRecover,
  onTransfer,
  onMaintenance,
  onRetire,
  onImport,
}) => {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col xl:flex-row gap-6 justify-between items-center">
      <div className="flex gap-3 w-full xl:w-auto">
        {selectedCount > 0 && (
          <div className="flex gap-2 animate-in slide-in-from-right-4">
            {canBulkReportDamage && (
              <button
                onClick={onReportDamage}
                className="bg-orange-500 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all"
              >
                Báo hỏng ({selectedCount})
              </button>
            )}
            {canBulkAllocate && (
              <button
                onClick={onAllocate}
                className="bg-indigo-600 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                Cấp phát
              </button>
            )}
            {canBulkRecover && (
              <button
                onClick={onRecover}
                className="bg-slate-800 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-black transition-all"
              >
                Thu hồi
              </button>
            )}
            {canBulkTransfer && (
              <button
                onClick={onTransfer}
                className="bg-blue-500 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all"
              >
                Điều chuyển
              </button>
            )}
            {canBulkMaintain && (
              <button
                onClick={onMaintenance}
                className="bg-amber-600 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all"
              >
                Sửa chữa
              </button>
            )}
            {canBulkRetire && (
              <button
                onClick={onRetire}
                className="bg-red-600 text-white px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
              >
                Thanh lý ({selectedCount})
              </button>
            )}
          </div>
        )}
        <button
          onClick={onImport}
          className="flex-1 xl:flex-none bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center group"
        >
          <i className="fas fa-plus-circle mr-2 group-hover:rotate-90 transition-transform duration-300"></i>{' '}
          Nhập tài sản
        </button>
      </div>
    </div>
  );
};
