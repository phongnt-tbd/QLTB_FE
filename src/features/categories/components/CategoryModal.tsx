import React from 'react';
import { AssetCategory } from '@/types';
import { CategoryFormData } from '../types';
import { categoryService } from '../services/categoryService';

interface CategoryModalProps {
  isOpen: boolean;
  editingCategory: AssetCategory | null;
  onClose: () => void;
  onSave: (formData: CategoryFormData) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  editingCategory,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const availableIcons = categoryService.getAvailableIcons();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSave({
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      description: formData.get('description') as string,
      icon: (formData.get('icon') as string) || 'fa-tag',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl p-10 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Tên danh mục
              </label>
              <input
                name="name"
                defaultValue={editingCategory?.name}
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="Ví dụ: Thiết bị văn phòng"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Mã danh mục
              </label>
              <input
                name="code"
                defaultValue={editingCategory?.code}
                required
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                placeholder="OFFICE_EQ"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Biểu tượng nhận diện
            </label>
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              {availableIcons.map(icon => (
                <label key={icon} className="cursor-pointer">
                  <input
                    type="radio"
                    name="icon"
                    value={icon}
                    defaultChecked={editingCategory?.icon === icon}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:border-blue-300 transition-all">
                    <i className={`fas ${icon} text-sm`}></i>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Mô tả danh mục
            </label>
            <textarea
              name="description"
              defaultValue={editingCategory?.description}
              rows={3}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              placeholder="Nhập mô tả chi tiết..."
            ></textarea>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
            >
              Xác nhận Lưu
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
