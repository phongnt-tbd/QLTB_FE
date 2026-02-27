import { useState } from 'react';
import { Supplier, CreateSupplierDTO } from '../types';
import { supplierService } from '../services/supplierService';

export const useSuppliers = (
  initialSuppliers: Supplier[],
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSup, setEditingSup] = useState<Supplier | null>(null);

  const openCreateModal = () => {
    setEditingSup(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sup: Supplier) => {
    setEditingSup(sup);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSup(null);
  };

  const createSupplier = (dto: CreateSupplierDTO) => {
    const errors = supplierService.validate(dto);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }
    setSuppliers((prev) => [...prev, supplierService.create(dto)]);
    return true;
  };

  const updateSupplier = (id: string, dto: Partial<CreateSupplierDTO>) => {
    const errors = supplierService.validate(dto);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }
    setSuppliers((prev) => prev.map((s) => (s.id === id ? supplierService.update(s, dto) : s)));
    return true;
  };

  const deleteSupplier = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) return;
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    isModalOpen,
    editingSup,
    openCreateModal,
    openEditModal,
    closeModal,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
