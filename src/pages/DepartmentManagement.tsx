
import React, { useState } from 'react';
import { Department } from '@/types';

interface DepartmentManagementProps {
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
}

const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ departments, setDepartments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Department = {
      id: editingDept?.id || `d${Date.now()}`,
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      managerId: editingDept?.managerId || '1',
      description: formData.get('description') as string,
    };
    if (editingDept) setDepartments(prev => prev.map(d => d.id === editingDept.id ? data : d));
    else setDepartments(prev => [...prev, data]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Danh sách Đơn vị</h2>
          <p className="text-sm text-slate-500 font-medium">Quản lý các khoa, phòng ban và trung tâm trong toàn trường</p>
        </div>
        <button
          onClick={() => { setEditingDept(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-2xl shadow-blue-500/20 flex items-center transition-all group"
        >
          <i className="fas fa-plus-circle mr-2 group-hover:rotate-90 transition-transform"></i> Thêm Đơn vị
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-blue-500 transition-all hover:shadow-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                <i className="fas fa-building text-2xl"></i>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingDept(dept); setIsModalOpen(true); }} className="w-9 h-9 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><i className="fas fa-edit"></i></button>
                <button onClick={() => setDepartments(prev => prev.filter(d => d.id !== dept.id))} className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-xl transition-all"><i className="fas fa-trash"></i></button>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{dept.name}</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 bg-blue-50 inline-block px-2 py-0.5 rounded-lg border border-blue-100 self-start">{dept.code}</p>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{dept.description || 'Không có mô tả chi tiết cho đơn vị này.'}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingDept ? 'Sửa Đơn vị' : 'Thêm Đơn vị mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên phòng ban / Khoa</label>
                <input name="name" defaultValue={editingDept?.name} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all" placeholder="Ví dụ: Khoa Công nghệ Thông tin" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã hiệu đơn vị</label>
                <input name="code" defaultValue={editingDept?.code} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all uppercase" placeholder="FIT, ADM, v.v." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả ngắn</label>
                <textarea name="description" defaultValue={editingDept?.description} rows={3} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold transition-all" placeholder="Thông tin chi tiết về chức năng nhiệm vụ..."></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">Lưu cấu hình</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
