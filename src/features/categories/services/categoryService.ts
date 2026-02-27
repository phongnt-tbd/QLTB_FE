import { AssetCategory, Asset } from '@/types';
import { CategoryFormData, CategoryWithCount } from '../types';

export const categoryService = {
  /**
   * Get asset count by category name
   */
  getAssetCountByCategory: (assets: Asset[], categoryName: string): number => {
    return assets
      .filter(a => a.category === categoryName)
      .reduce((sum, a) => sum + a.totalQuantity, 0);
  },

  /**
   * Get categories with asset counts
   */
  getCategoriesWithCounts: (
    categories: AssetCategory[],
    assets: Asset[]
  ): CategoryWithCount[] => {
    return categories.map(category => ({
      ...category,
      assetCount: categoryService.getAssetCountByCategory(assets, category.name),
    }));
  },

  /**
   * Create new category
   */
  createCategory: (formData: CategoryFormData): AssetCategory => {
    return {
      id: `cat-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      icon: formData.icon || 'fa-tag',
    };
  },

  /**
   * Update category
   */
  updateCategory: (
    category: AssetCategory,
    formData: CategoryFormData
  ): AssetCategory => {
    return {
      ...category,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      icon: formData.icon,
    };
  },

  /**
   * Available icons for categories
   */
  getAvailableIcons: (): string[] => {
    return [
      'fa-laptop',
      'fa-desktop',
      'fa-print',
      'fa-video',
      'fa-chair',
      'fa-table',
      'fa-network-wired',
      'fa-server',
      'fa-mobile-alt',
      'fa-headphones',
      'fa-camera',
      'fa-tools',
      'fa-microchip',
    ];
  },
};
