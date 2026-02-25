
import { UserRole, User, Department, Supplier, Asset, AssetItemStatus, PermissionConfig, SystemConfig, TransferRequest, AssetCategory } from '@/shared/types';

// Dữ liệu PDF giả lập (Chuỗi base64 của một file PDF trắng nhỏ)
const DUMMY_PDF = 'data:application/pdf;base64,JVBERi0xLjQKJebj09IKMSAwIG9iago8PAovVGl0bGUgK870v9UgY2jhu6luZyB04bubKQovQ3JlYXRvciAoVW5pQXNzZXQpCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKMyAwIG9iago8PAovVGl0bGUgK870v9UgY2jhu6luZyB04bubKQovVHlwZSAvUGFnZXMKL0NvdW50IDEKL0tpZHMgWzQgMCBSXQo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDU5NSA4NDJdCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Ci9Db250ZW50cyA2IDAgUgo+PgplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKICAvRjEgMjQgVGYKICA3MiA3MjAgVGQKICAoQ0hVTkcgVFUgVUFJIBTQU4pIFRqCkVORAplbmRzdHJlYW0KZW5kb2JqCnRyYWlsZXIKPDwKL1NpemUgNwolUm9vdCAyIDAgUgo+PgpstartxrefCjM1OQolJUVPRgo=';

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', fullName: 'Nguyễn Văn Admin', email: 'admin@uni.edu.vn', phone: '0901234567', avatar: 'https://picsum.photos/seed/admin/200', role: UserRole.SYSTEM_ADMIN, isLocked: false, createdAt: '2023-01-01' },
  { id: '2', username: 'manager_hung', fullName: 'Trần Thế Hùng', email: 'hung.tt@uni.edu.vn', phone: '0902345678', avatar: 'https://picsum.photos/seed/manager/200', role: UserRole.ASSET_MANAGER, isLocked: false, createdAt: '2023-03-15' }
];

export const INITIAL_CATEGORIES: AssetCategory[] = [
  { id: 'cat1', name: 'Máy tính xách tay', code: 'LAPTOP', description: 'Các loại máy tính xách tay cho cán bộ giảng viên', icon: 'fa-laptop' },
  { id: 'cat2', name: 'Máy chiếu', code: 'PROJECTOR', description: 'Thiết bị trình chiếu tại giảng đường', icon: 'fa-video' },
  { id: 'cat3', name: 'Bàn ghế văn phòng', code: 'FURNITURE', description: 'Nội thất văn phòng và giảng đường', icon: 'fa-chair' },
  { id: 'cat4', name: 'Thiết bị mạng', code: 'NETWORK', description: 'Router, Switch, Access Point', icon: 'fa-network-wired' }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'stock', name: 'Kho trung tâm', code: 'WAREHOUSE', managerId: '1', description: 'Kho chứa tài sản tổng' },
  { id: 'd1', name: 'Khoa Công nghệ Thông tin', code: 'FIT', managerId: '2', description: 'Phụ trách đào tạo CNTT' },
  { id: 'd2', name: 'Phòng Hành chính Tổng hợp', code: 'ADM', managerId: '1', description: 'Quản lý chung' }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Công ty Máy tính Phong Vũ', taxCode: '0102030405', contactPerson: 'Nguyễn Văn A', phone: '19006067', email: 'contact@phongvu.vn' },
  { id: 's2', name: 'Dell Vietnam', taxCode: '0908070605', contactPerson: 'John Doe', phone: '0281234567', email: 'support@dell.com' }
];

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'a1',
    batchCode: 'LOT-2023-001',
    name: 'Laptop Dell Latitude 5420',
    category: 'Máy tính xách tay',
    specifications: 'Core i5, 8GB RAM, 256GB SSD',
    totalQuantity: 3,
    supplierId: 's2',
    purchaseDate: '2023-10-10',
    unitPrice: 18500000,
    warrantyMonths: 12,
    importPdfUrl: DUMMY_PDF,
    history: [
      { id: 'h1', assetId: 'a1', type: 'Import', date: '2023-10-10', description: 'Nhập lô hàng 3 máy từ Dell Vietnam. Hóa đơn gốc được đính kèm.', performedBy: 'Trần Thế Hùng', pdfUrl: DUMMY_PDF }
    ],
    items: [
      { id: 'i1', assetCode: 'LOT-2023-001-001', batchId: 'a1', status: AssetItemStatus.ALLOCATED, currentDeptId: 'd1', allocationDate: '2023-10-15', pdfUrl: DUMMY_PDF },
      { id: 'i2', assetCode: 'LOT-2023-001-002', batchId: 'a1', status: AssetItemStatus.IN_STOCK },
      { id: 'i3', assetCode: 'LOT-2023-001-003', batchId: 'a1', status: AssetItemStatus.IN_STOCK }
    ]
  }
];

export const INITIAL_PERMISSIONS: PermissionConfig[] = [
  {
    role: UserRole.SYSTEM_ADMIN,
    permissions: {
      viewDashboard: true,
      manageAssets: true,
      manageUsers: true,
      manageInventory: true,
      manageDepartments: true,
      manageSuppliers: true,
      configureSystem: true,
    }
  },
  {
    role: UserRole.ASSET_MANAGER,
    permissions: {
      viewDashboard: true,
      manageAssets: true,
      manageUsers: false,
      manageInventory: true,
      manageDepartments: true,
      manageSuppliers: false,
      configureSystem: false,
    }
  },
  {
    role: UserRole.TECHNICIAN,
    permissions: {
      viewDashboard: true,
      manageAssets: false,
      manageUsers: false,
      manageInventory: false,
      manageDepartments: false,
      manageSuppliers: false,
      configureSystem: false,
    }
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  notificationsEnabled: true,
  alertThreshold: 5,
  autoBackup: true,
  maintenanceInterval: 30
};

export const INITIAL_TRANSFERS: TransferRequest[] = [
  {
    id: 'tr1',
    assetId: 'a1',
    fromDeptId: 'd1',
    toDeptId: 'd2',
    reason: 'Phòng FIT thừa máy, ADM cần bổ sung gấp',
    requestedAt: '2023-11-01',
    status: 'Pending'
  }
];
