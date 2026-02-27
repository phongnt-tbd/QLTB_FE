// Types cho AssetManagement feature
import type { AssetItemStatus } from '@/types';

export interface AssetItem {
  id: string;
  assetCode: string;
  batchId: string;
  status: AssetItemStatus;
  currentDeptId?: string;
  allocationDate?: string;
  pdfUrl?: string;
}

export interface LifecycleEvent {
  id: string;
  assetId: string;
  type: 'Import' | 'Allocation' | 'Recovery' | 'Maintenance' | 'Retire' | 'Transfer';
  date: string;
  description: string;
  performedBy: string;
  pdfUrl?: string;
  fromDept?: string;
  toDept?: string;
  cost?: number;
  provider?: string;
}

export interface Asset {
  id: string;
  batchCode: string;
  name: string;
  category: string;
  specifications: string;
  totalQuantity: number;
  supplierId: string;
  purchaseDate: string;
  unitPrice: number;
  warrantyMonths: number;
  importPdfUrl: string;
  history: LifecycleEvent[];
  items: AssetItem[];
}

export interface AssetWithParent extends AssetItem {
  parentBatch: Asset;
}

export interface CreateAssetDTO {
  name: string;
  category: string;
  specifications: string;
  quantity: number;
  supplierId: string;
  purchaseDate: string;
  unitPrice: number;
  warrantyMonths: number;
  importPdfUrl: string;
}

export interface AllocateAssetDTO {
  itemIds: string[];
  departmentId: string;
  pdfUrl?: string;
}

export interface TransferAssetDTO {
  itemIds: string[];
  toDepartmentId: string;
}

export interface MaintenanceDTO {
  itemIds: string[];
  provider: string;
  details: Record<string, { reason: string; cost: number }>;
}

export interface RetireAssetDTO {
  itemIds: string[];
  reason: string;
  pdfUrl?: string;
}

export interface DamageReportDTO {
  itemIds: string[];
  reason: string;
}

export interface AssetFilters {
  search: string;
  statusFilter: string;
  categoryFilter: string;
}

export interface AssetStats {
  total: number;
  inStock: number;
  allocated: number;
  damaged: number;
  retired: number;
}
