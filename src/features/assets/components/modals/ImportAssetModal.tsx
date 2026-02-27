import React from 'react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { AssetCategory, Supplier } from '@/types';
import { CreateAssetDTO } from '../../types';
import { assetService } from '../../services/assetService';

interface ImportAssetModalProps {
  isOpen: boolean;
  categories: AssetCategory[];
  suppliers: Supplier[];
  onClose: () => void;
  onSubmit: (dto: CreateAssetDTO) => void;
}

export const ImportAssetModal: React.FC<ImportAssetModalProps> = ({
  isOpen,
  categories,
  suppliers,
  onClose,
  onSubmit,
}) => {
  const { fileName, fileData, isProcessing, fileInputRef, handleFileSelect, resetFile } = useFileUpload();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isProcessing) {
      alert('Đang xử lý file PDF, vui lòng đợi trong giây lát...');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const quantity = parseInt(formData.get('quantity') as string);
    const unitPrice = parseInt(formData.get('unitPrice') as string) || 0;
    const warrantyValue = parseInt(formData.get('warrantyValue') as string) || 0;
    const warrantyUnit = formData.get('warrantyUnit') as string;
    const totalWarrantyMonths = warrantyUnit === 'year' ? warrantyValue * 12 : warrantyValue;

    const dto: CreateAssetDTO = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      specifications: (formData.get('specifications') as string) || 'N/A',
      quantity,
      supplierId: formData.get('supplierId') as string,
      purchaseDate: formData.get('purchaseDate') as string,
      unitPrice,
      warrantyMonths: totalWarrantyMonths,
      importPdfUrl: fileData || '',
    };

    // Validate
    const errors = assetService.validateCreateAsset(dto);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    onSubmit(dto);
    resetFile();
  };

  const handleClose = () => {
    resetFile();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl p-10 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Nhập kho lô tài sản mới</h3>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Tên tài sản
              </label>
              <input
                name="name"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
                placeholder="Ví dụ: Laptop Dell XPS 13"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Danh mục
              </label>
              <select
                name="category"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all cursor-pointer"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Số lượng nhập
              </label>
              <input
                name="quantity"
                type="number"
                min="1"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all"
                placeholder="1"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Đơn giá (VNĐ)
              </label>
              <div className="relative">
                <input
                  name="unitPrice"
                  type="number"
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all"
                  placeholder="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">
                  VNĐ
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Ngày mua / Ngày nhập
              </label>
              <input
                name="purchaseDate"
                type="date"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nhà cung cấp
              </label>
              <select
                name="supplierId"
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all cursor-pointer"
              >
                <option value="">-- Chọn đơn vị cung ứng --</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Thời gian bảo hành
              </label>
              <div className="flex gap-2">
                <input
                  name="warrantyValue"
                  type="number"
                  min="0"
                  required
                  className="flex-1 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all"
                  placeholder="0"
                />
                <select
                  name="warrantyUnit"
                  className="w-32 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold transition-all cursor-pointer"
                >
                  <option value="month">Tháng</option>
                  <option value="year">Năm</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Thông số kỹ thuật
              </label>
              <input
                name="specifications"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
                placeholder="Tùy chọn"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Hóa đơn chứng từ (PDF)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`w-full px-5 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group ${
                isProcessing ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div
                className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm mb-3 ${
                  isProcessing ? 'animate-pulse' : ''
                }`}
              >
                <i className={`fas ${isProcessing ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-xl`}></i>
              </div>
              <span className="text-sm font-bold text-slate-600">
                {isProcessing
                  ? 'Đang đọc nội dung file...'
                  : fileName || 'Chọn hoặc kéo thả file hóa đơn PDF vào đây'}
              </span>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isProcessing ? 'Vui lòng đợi...' : 'Hoàn tất nhập kho'}
            </button>
            <button
              type="button"
              onClick={handleClose}
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
