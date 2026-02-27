import { useState } from 'react';
import { Department, CreateDepartmentDTO } from '../types';
import { departmentService } from '../services/departmentService';

export const useDepartments = (
  initialDepartments: Department[],
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const openCreateModal = () => {
    setEditingDept(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
  };

  const createDepartment = (dto: CreateDepartmentDTO) => {
    const errors = departmentService.validate(dto);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }

    const newDept = departmentService.create(dto);
    setDepartments((prev) => [...prev, newDept]);
    return true;
  };

  const updateDepartment = (id: string, dto: Partial<CreateDepartmentDTO>) => {
    const errors = departmentService.validate(dto);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }

    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? departmentService.update(d, dto) : d))
    );
    return true;
  };

  const deleteDepartment = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn vị này?')) {
      return;
    }

    setDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  return {
    isModalOpen,
    editingDept,
    openCreateModal,
    openEditModal,
    closeModal,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
