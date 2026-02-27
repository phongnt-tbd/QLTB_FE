import { useState, useMemo } from 'react';
import { AssetCategory, Asset } from '@/types';
import { CategoryModalState, CategoryFormData } from '../types';
import { categoryService } from '../services/categoryService';

export const useCategories = (
  categories: AssetCategory[],
  setCategories: React.Dispatch<React.SetStateAction<AssetCategory[]>>,
  assets: Asset[]
) => {
  const [modalState, setModalState] = useState<CategoryModalState>({
    isOpen: false,
    editingCategory: null,
  });

  const categoriesWithCounts = useMemo(
    () => categoryService.getCategoriesWithCounts(categories, assets),
    [categories, assets]
  );

  const openCreateModal = () => {
    setModalState({ isOpen: true, editingCategory: null });
  };

  const openEditModal = (category: AssetCategory) => {
    setModalState({ isOpen: true, editingCategory: category });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, editingCategory: null });
  };

  const handleSave = (formData: CategoryFormData) => {
    if (modalState.editingCategory) {
      // Update existing
      const updated = categoryService.updateCategory(
        modalState.editingCategory,
        formData
      );
      setCategories(prev =>
        prev.map(c => (c.id === modalState.editingCategory!.id ? updated : c))
      );
    } else {
      // Create new
      const newCategory = categoryService.createCategory(formData);
      setCategories(prev => [...prev, newCategory]);
    }
    closeModal();
  };

  const handleDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  return {
    categoriesWithCounts,
    modalState,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
  };
};
