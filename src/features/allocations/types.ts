import { Asset, AssetItem, Department } from '@/types';

export interface ItemWithBatch extends AssetItem {
  parentBatch: Asset;
}

export interface DepartmentWithCount extends Department {
  assetCount: number;
}

export interface AllocationFilters {
  deptSearchTerm: string;
  assetSearchTerm: string;
}

export interface FileUploadState {
  fileName: string | null;
  fileData: string | null;
  isProcessing: boolean;
}
