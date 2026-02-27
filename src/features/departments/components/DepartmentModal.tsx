import React from 'react';
import { Department, CreateDepartmentDTO } from '../types';

interface DepartmentModalProps {
  isOpen: boolean;
  department: Department | null;
  onClose: () => void;
  onSave: (data: CreateDepartmentDTO) => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  department,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: CreateDepartmentDTO = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      description: formData.get('description') as string,
    };

    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {department ? 'Sửa Đơn vị' : 'Thêm Đơn vị mới'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Tên phòng ban / Khoa
            </label>
            <input
              name="name"
              defaultValue={department?.name}
              required
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
              placeholder="Ví dụ: Khoa Công nghệ Thông tin"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Mã hiệu đơn vị
            </label>
            <input
              name="code"
              defaultValue={department?.code}
              required
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all uppercase"
              placeholder="FIT, ADM, v.v."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Mô tả ngắn
            </label>
            <textarea
              name="description"
              defaultValue={department?.description}
              rows={3}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all"
              placeholder="Thông tin chi tiết về chức năng nhiệm vụ..."
            ></textarea>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs"
            >
              Lưu cấu hình
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
