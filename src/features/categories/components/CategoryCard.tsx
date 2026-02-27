import React from 'react';
import { CategoryWithCount } from '../types';

interface CategoryCardProps {
  category: CategoryWithCount;
  onEdit: () => void;
  onDelete: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all group flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
        >
          <i className="fas fa-pen text-[10px]"></i>
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
        >
          <i className="fas fa-trash text-[10px]"></i>
        </button>
      </div>

      <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all mb-6">
        <i className={`fas ${category.icon} text-2xl`}></i>
      </div>

      <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight">
        {category.name}
      </h3>
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
        {category.code}
      </p>
      <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6 flex-1">
        {category.description || 'Không có mô tả cho danh mục này.'}
      </p>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Sản phẩm hiện có
        </span>
        <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-[10px] font-black">
          {category.assetCount}
        </span>
      </div>
    </div>
  );
};
