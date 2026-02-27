import React, { useState } from 'react';
import { MaintenanceDTO } from '../../types';

interface MaintenanceModalProps {
  isOpen: boolean;
  selectedIds: string[];
  selectedItems: any[];
  onClose: () => void;
  onSubmit: (dto: MaintenanceDTO) => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  selectedIds,
  selectedItems,
  onClose,
  onSubmit,
}) => {
  const [provider, setProvider] = useState('');
  const [details, setDetails] = useState<Record<string, { reason: string; cost: number }>>({});

  if (!isOpen) return null;

  const handleDetailChange = (itemId: string, field: 'reason' | 'cost', value: string | number) => {
    setDetails((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all items have details
    const missingDetails = selectedIds.some((id) => !details[id]?.reason || !details[id]?.cost);
    if (missingDetails) {
      alert('Vui lòng nhập đầy đủ thông tin cho tất cả tài sản');
      return;
    }

    onSubmit({
      itemIds: selectedIds,
      provider,
      details,
    });

    setProvider('');
    setDetails({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl p-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gửi sửa chữa</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-amber-800">
              Gửi sửa chữa <span className="font-black">{selectedIds.length}</span> tài sản
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Đơn vị sửa chữa *
            </label>
            <input
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
              placeholder="Tên đơn vị / Cửa hàng sửa chữa"
            />
          </div>

          <div className="space-y-2 flex-1 overflow-hidden flex flex-col">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Chi tiết sửa chữa từng tài sản *
            </label>
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">
                      Mã TS
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">
                      Lý do sửa chữa
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase">
                      Chi phí (VNĐ)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600">
                        {item.assetCode}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={details[item.id]?.reason || ''}
                          onChange={(e) =>
                            handleDetailChange(item.id, 'reason', e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/20"
                          placeholder="Ví dụ: Thay màn hình"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={details[item.id]?.cost || ''}
                          onChange={(e) =>
                            handleDetailChange(item.id, 'cost', parseInt(e.target.value) || 0)
                          }
                          required
                          min="0"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-amber-500/20"
                          placeholder="0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              disabled={!provider.trim()}
              className="flex-1 py-4 bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:bg-amber-700 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
            >
              Xác nhận gửi sửa
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
