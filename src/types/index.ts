export enum UserRole {
  SYSTEM_ADMIN = 'System Admin',
  ASSET_MANAGER = 'Asset Manager',
  TECHNICIAN = 'Technician',
}

export enum AssetItemStatus {
  IN_STOCK = 'Trong kho',
  ALLOCATED = 'Đang sử dụng',
  MAINTENANCE = 'Bảo trì',
  DAMAGED = 'Đã hỏng',
  RETIRED = 'Thanh lý',
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  isLocked: boolean;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId: string;
  description: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: string;
}

export interface Supplier {
  id: string;
  name: string;
  taxCode: string;
  contactPerson: string;
  phone: string;
  email: string;
}

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

export interface PermissionConfig {
  role: UserRole;
  permissions: {
    viewDashboard: boolean;
    manageAssets: boolean;
    manageUsers: boolean;
    manageInventory: boolean;
    manageDepartments: boolean;
    manageSuppliers: boolean;
    configureSystem: boolean;
  };
}

export interface SystemConfig {
  notificationsEnabled: boolean;
  alertThreshold: number;
  autoBackup: boolean;
  maintenanceInterval: number;
}

export interface TransferRequest {
  id: string;
  assetId: string;
  fromDeptId: string;
  toDeptId: string;
  reason: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

