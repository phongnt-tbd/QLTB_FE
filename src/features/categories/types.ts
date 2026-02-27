import { AssetCategory, Asset } from '@/types';

export interface CategoryFormData {
  name: string;
  code: string;
  description: string;
  icon: string;
}

export interface CategoryWithCount extends AssetCategory {
  assetCount: number;
}

export interface CategoryModalState {
  isOpen: boolean;
  editingCategory: AssetCategory | null;
}
