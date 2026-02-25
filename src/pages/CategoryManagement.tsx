
import React, { useState } from 'react';
import { AssetCategory, Asset } from '@/shared/types';

interface CategoryManagementProps {
  categories: AssetCategory[];
  setCategories: React.Dispatch<React.SetStateAction<AssetCategory[]>>;
  assets: Asset[];
}

const CategoryManagement: React.FC<CategoryManagementProps> = ({ categories, setCategories, assets }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<AssetCategory | null>(null);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: AssetCategory = {
      id: editingCat?.id || `cat-${Date.now()}`,
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      description: formData.get('description') as string,
      icon: formData.get('icon') as string || 'fa-tag',
    };

    if (editingCat) {
      setCategories(prev => prev.map(c => c.id === editingCat.id ? data : c));
    } else {
      setCategories(prev => [...prev, data]);
    }
    setIsModalOpen(false);
    setEditingCat(null);
  };

  const getAssetCountByCategory = (categoryName: string) => {
    return assets.filter(a => a.category === categoryName).reduce((sum, a) => sum + a.totalQuantity, 0);
  };

  const availableIcons = [
    'fa-laptop', 'fa-desktop', 'fa-print', 'fa-video', 'fa-chair',
    'fa-table', 'fa-network-wired', 'fa-server', 'fa-mobile-alt',
    'fa-headphones', 'fa-camera', 'fa-tools', 'fa-microchip'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Danh mục tài sản chính thức</h2>
          <p className="text-sm text-slate-500 font-medium">Định nghĩa các loại tài sản hiện có trong trường</p>
        </div>
        <button
          onClick={() => { setEditingCat(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-500/20 flex items-center transition-all"
        >
          <i className="fas fa-plus-circle mr-2"></i> Thêm Danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all group flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => { setEditingCat(cat); setIsModalOpen(true); }} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><i className="fas fa-pen text-[10px]"></i></button>
               <button onClick={() => setCategories(prev => prev.filter(c => c.id !== cat.id))} className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><i className="fas fa-trash text-[10px]"></i></button>
            </div>

            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all mb-6">
              <i className={`fas ${cat.icon} text-2xl`}></i>
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight">{cat.name}</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">{cat.code}</p>
            <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6 flex-1">{cat.description || 'Không có mô tả cho danh mục này.'}</p>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm hiện có</span>
              <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-[10px] font-black">{getAssetCountByCategory(cat.name)}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{editingCat ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên danh mục</label>
                  <input name="name" defaultValue={editingCat?.name} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Ví dụ: Thiết bị văn phòng" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã danh mục</label>
                  <input name="code" defaultValue={editingCat?.code} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="OFFICE_EQ" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biểu tượng nhận diện</label>
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {availableIcons.map(icon => (
                    <label key={icon} className="cursor-pointer">
                      <input type="radio" name="icon" value={icon} defaultChecked={editingCat?.icon === icon} className="sr-only peer" />
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 peer-checked:bg-blue-600 peer-checked:text-white peer-checked:border-blue-600 hover:border-blue-300 transition-all">
                        <i className={`fas ${icon} text-sm`}></i>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mô tả danh mục</label>
                <textarea name="description" defaultValue={editingCat?.description} rows={3} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="Nhập mô tả chi tiết..."></textarea>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase tracking-widest text-xs">Xác nhận Lưu</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
