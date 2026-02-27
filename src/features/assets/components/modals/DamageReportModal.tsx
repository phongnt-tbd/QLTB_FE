import React, { useState } from 'react';
import { DamageReportDTO } from '../../types';

interface DamageReportModalProps {
  isOpen: boolean;
  selectedIds: string[];
  onClose: () => void;
  onSubmit: (dto: DamageReportDTO) => void;
}

export const DamageReportModal: React.FC<DamageReportModalProps> = ({
  isOpen,
  selectedIds,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      itemIds: selectedIds,
      reason,
    });
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl p-10 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Báo hỏng tài sản</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-orange-800">
              Bạn đang báo hỏng <span className="font-black">{selectedIds.length}</span> tài sản
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Lý do báo hỏng *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
              placeholder="Mô tả chi tiết tình trạng hỏng hóc..."
            />
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              disabled={!reason.trim()}
              className="flex-1 py-4 bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 hover:bg-orange-700 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
            >
              Xác nhận báo hỏng
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
