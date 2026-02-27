import React from 'react';
import { AssetCategory, Asset } from '@/types';
import { useCategories } from '../hooks/useCategories';
import { CategoryCard } from '../components/CategoryCard';
import { CategoryModal } from '../components/CategoryModal';

interface CategoriesPageProps {
  categories: AssetCategory[];
  setCategories: React.Dispatch<React.SetStateAction<AssetCategory[]>>;
  assets: Asset[];
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  categories,
  setCategories,
  assets,
}) => {
  const {
    categoriesWithCounts,
    modalState,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
    handleDelete,
  } = useCategories(categories, setCategories, assets);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Danh mục tài sản chính thức
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Định nghĩa các loại tài sản hiện có trong trường
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-500/20 flex items-center transition-all"
        >
          <i className="fas fa-plus-circle mr-2"></i> Thêm Danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoriesWithCounts.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onEdit={() => openEditModal(cat)}
            onDelete={() => handleDelete(cat.id)}
          />
        ))}
      </div>

      <CategoryModal
        isOpen={modalState.isOpen}
        editingCategory={modalState.editingCategory}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
};
