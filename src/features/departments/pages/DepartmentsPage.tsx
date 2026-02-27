import React from 'react';
import { Department } from '@/types';
import { useDepartments } from '../hooks/useDepartments';
import { DepartmentCard } from '../components/DepartmentCard';
import { DepartmentModal } from '../components/DepartmentModal';

interface DepartmentsPageProps {
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ departments, setDepartments }) => {
  const {
    isModalOpen,
    editingDept,
    openCreateModal,
    openEditModal,
    closeModal,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments(departments, setDepartments);

  const handleSave = (data: any) => {
    let success = false;
    if (editingDept) {
      success = updateDepartment(editingDept.id, data);
    } else {
      success = createDepartment(data);
    }

    if (success) {
      closeModal();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Danh sách Đơn vị</h2>
          <p className="text-sm text-slate-500 font-medium">
            Quản lý các khoa, phòng ban và trung tâm trong toàn trường
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-2xl shadow-blue-500/20 flex items-center transition-all group"
        >
          <i className="fas fa-plus-circle mr-2 group-hover:rotate-90 transition-transform"></i> Thêm Đơn
          vị
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            onEdit={openEditModal}
            onDelete={deleteDepartment}
          />
        ))}
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        department={editingDept}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
};
