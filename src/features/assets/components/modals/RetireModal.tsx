import React, { useState, useRef } from 'react';
import { RetireAssetDTO } from '../../types';

interface RetireModalProps {
  isOpen: boolean;
  selectedIds: string[];
  onClose: () => void;
  onSubmit: (dto: RetireAssetDTO) => void;
}

export const RetireModal: React.FC<RetireModalProps> = ({
  isOpen,
  selectedIds,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState('');
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Chỉ hỗ trợ file PDF.');
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPdfFile(e.target?.result as string);
      setIsProcessing(false);
    };
    reader.onerror = () => {
      alert('Lỗi đọc file.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) {
      alert('Vui lòng đợi xử lý file.');
      return;
    }

    onSubmit({
      itemIds: selectedIds,
      reason,
      pdfUrl: pdfFile || undefined,
    });

    setReason('');
    setPdfFile(null);
    setFileName(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl p-10 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Thanh lý tài sản</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="text-sm font-bold text-red-800">
              Bạn đang thanh lý <span className="font-black">{selectedIds.length}</span> tài sản
            </p>
            <p className="text-xs text-red-600 mt-1">Hành động này không thể hoàn tác</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Lý do thanh lý *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all"
              placeholder="Ví dụ: Hết hạn sử dụng, hỏng không sửa được..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Biên bản thanh lý (PDF)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-4 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-all group ${
                isProcessing ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div
                className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-red-600 shadow-sm ${
                  isProcessing ? 'animate-pulse' : ''
                }`}
              >
                <i
                  className={`fas ${isProcessing ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-xl`}
                ></i>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {fileName || 'Đính kèm biên bản thanh lý'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isProcessing ? 'Đang đọc dữ liệu...' : 'Bấm để chọn file PDF'}
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              disabled={!reason.trim() || isProcessing}
              className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-700 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
            >
              Xác nhận thanh lý
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
