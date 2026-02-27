import React from 'react';
import { Department } from '../types';

interface DepartmentCardProps {
  department: Department;
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-blue-500 transition-all hover:shadow-xl p-8">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
          <i className="fas fa-building text-2xl"></i>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(department)}
            className="w-9 h-9 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => onDelete(department.id)}
            className="w-9 h-9 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-xl transition-all"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
        {department.name}
      </h3>
      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 bg-blue-50 inline-block px-2 py-0.5 rounded-lg border border-blue-100 self-start">
        {department.code}
      </p>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">
        {department.description || 'Không có mô tả chi tiết cho đơn vị này.'}
      </p>
    </div>
  );
};
