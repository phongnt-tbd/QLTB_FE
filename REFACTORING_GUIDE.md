# Feature-Based Architecture Refactoring Guide

## 📁 Cấu trúc folder mới (Feature-Based Architecture)

```
src/
├── app/
│   ├── App.tsx                          # Chỉ chứa routing và global state
│   ├── main.tsx                         # Entry point
│   └── providers/                       # Global providers (nếu cần)
│       └── AppProvider.tsx
│
├── features/                            # ⭐ Tất cả features tại đây
│   ├── assets/                          # Feature: Quản lý tài sản
│   │   ├── components/                  # Components riêng của feature
│   │   │   ├── AssetTable.tsx
│   │   │   ├── AssetStatsCards.tsx
│   │   │   ├── AssetFilters.tsx
│   │   │   ├── AssetActionBar.tsx
│   │   │   └── modals/
│   │   │       ├── ImportAssetModal.tsx
│   │   │       ├── AllocateModal.tsx
│   │   │       ├── TransferModal.tsx
│   │   │       ├── MaintenanceModal.tsx
│   │   │       ├── RetireModal.tsx
│   │   │       └── DamageReportModal.tsx
│   │   ├── hooks/                       # Custom hooks cho business logic
│   │   │   ├── useAssets.ts
│   │   │   ├── useAssetFilters.ts
│   │   │   ├── useAssetActions.ts
│   │   │   ├── useAssetSelection.ts
│   │   │   └── useFileUpload.ts
│   │   ├── services/                    # API calls & business logic
│   │   │   ├── assetService.ts
│   │   │   └── assetValidation.ts
│   │   ├── types.ts                     # Types riêng của feature
│   │   └── pages/
│   │       ├── AssetManagementPage.tsx  # Main page (chỉ compose UI)
│   │       └── AssetDetailPage.tsx
│   │
│   ├── allocations/                     # Feature: Cấp phát
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── pages/
│   │       └── AllocationManagementPage.tsx
│   │
│   ├── maintenance/                     # Feature: Bảo trì
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── pages/
│   │       └── MaintenanceManagementPage.tsx
│   │
│   ├── transfers/                       # Feature: Điều chuyển
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── pages/
│   │       └── TransferManagementPage.tsx
│   │
│   ├── departments/                     # Feature: Đơn vị
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── pages/
│   │       └── DepartmentManagementPage.tsx
│   │
│   ├── suppliers/                       # Feature: Nhà cung cấp
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── pages/
│   │       └── SupplierManagementPage.tsx
│   │
│   ├── categories/                      # Feature: Danh mục
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── pages/
│   │       └── CategoryManagementPage.tsx
│   │
│   ├── users/                           # Feature: Người dùng
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── pages/
│   │       └── UserManagementPage.tsx
│   │
│   ├── dashboard/                       # Feature: Dashboard
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── pages/
│   │       └── DashboardPage.tsx
│   │
│   ├── auth/                            # Feature: Authentication
│   │   ├── components/
│   │   │   └── LoginForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── types.ts
│   │   └── pages/
│   │       └── LoginPage.tsx
│   │
│   └── profile/                         # Feature: Profile
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types.ts
│       └── pages/
│           └── ProfilePage.tsx
│
├── components/                          # ⭐ Shared/Common components
│   ├── ui/                              # Base UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.types.ts
│   │   │   └── index.ts
│   │   ├── Table/
│   │   │   ├── Table.tsx
│   │   │   ├── TableRow.tsx
│   │   │   ├── TableCell.tsx
│   │   │   ├── Table.types.ts
│   │   │   └── index.ts
│   │   ├── FormField/
│   │   │   ├── FormField.tsx
│   │   │   ├── FormField.types.ts
│   │   │   └── index.ts
│   │   ├── Pagination/
│   │   │   ├── Pagination.tsx
│   │   │   ├── Pagination.types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Textarea/
│   │   ├── SearchInput/
│   │   └── FileUpload/
│   │
│   └── layout/                          # Layout components
│       ├── MainLayout/
│       │   ├── MainLayout.tsx
│       │   └── index.ts
│       ├── Header/
│       │   ├── Header.tsx
│       │   ├── Header.types.ts
│       │   └── index.ts
│       ├── Sidebar/
│       │   ├── Sidebar.tsx
│       │   ├── NavigationMenu.tsx
│       │   ├── Sidebar.types.ts
│       │   └── index.ts
│       └── Footer/
│           ├── Footer.tsx
│           └── index.ts
│
├── hooks/                               # ⭐ Global custom hooks
│   ├── useLocalStorage.ts
│   ├── usePagination.ts
│   ├── useDebounce.ts
│   ├── useToggle.ts
│   └── useClickOutside.ts
│
├── services/                            # ⭐ Global services
│   ├── localStorage/
│   │   ├── localStorageService.ts
│   │   └── storageKeys.ts
│   └── validation/
│       └── commonValidation.ts
│
├── types/                               # ⭐ Global shared types
│   ├── index.ts
│   ├── common.types.ts
│   └── api.types.ts
│
├── utils/                               # ⭐ Utility functions
│   ├── date.ts
│   ├── format.ts
│   ├── string.ts
│   └── validation.ts
│
├── constants/                           # ⭐ Global constants
│   ├── index.ts
│   ├── routes.ts
│   └── config.ts
│
└── styles/                              # Global styles (nếu cần)
    └── globals.css
```

---

## 🎯 Nguyên tắc tổ chức

### 1. **Feature-Based Organization**
- Mỗi feature là một module độc lập
- Tất cả code liên quan đến feature ở trong folder riêng
- Dễ dàng tìm kiếm và maintain

### 2. **Separation of Concerns**
- **Pages**: Chỉ compose UI, không chứa logic
- **Components**: UI thuần túy, nhận props
- **Hooks**: Business logic, side effects
- **Services**: API calls, data transformation
- **Types**: Type definitions

### 3. **Code Reusability**
- Components dùng chung → `components/ui/`
- Hooks dùng chung → `hooks/`
- Utils dùng chung → `utils/`
- Services dùng chung → `services/`

### 4. **Single Responsibility**
- Mỗi file chỉ làm một việc
- Mỗi function chỉ làm một việc
- Dễ test, dễ maintain

---

## 📝 Quy tắc đặt tên

### Files
- **Components**: PascalCase (ví dụ: `AssetTable.tsx`)
- **Hooks**: camelCase với prefix `use` (ví dụ: `useAssets.ts`)
- **Services**: camelCase với suffix `Service` (ví dụ: `assetService.ts`)
- **Types**: camelCase với suffix `.types.ts` (ví dụ: `asset.types.ts`)
- **Utils**: camelCase (ví dụ: `formatDate.ts`)

### Folders
- Tất cả folders: lowercase với dấu gạch ngang (ví dụ: `asset-management/`)
- Trừ component folders có thể PascalCase (ví dụ: `Button/`)

### Variables & Functions
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Functions**: camelCase
- **React Components**: PascalCase
- **Types/Interfaces**: PascalCase

---

## 🚀 Tại sao tách như vậy?

### ✅ Ưu điểm

1. **Scalability (Mở rộng dễ dàng)**
   - Thêm feature mới không ảnh hưởng code cũ
   - Mỗi feature độc lập, có thể phát triển song song

2. **Maintainability (Dễ bảo trì)**
   - Code có cấu trúc rõ ràng
   - Tìm bug nhanh chóng
   - Refactor dễ dàng

3. **Testability (Dễ test)**
   - Mỗi phần nhỏ, dễ viết unit test
   - Mock dễ dàng
   - Coverage cao

4. **Reusability (Tái sử dụng)**
   - Components, hooks, utils dùng lại nhiều nơi
   - Không duplicate code

5. **Team Collaboration**
   - Nhiều người làm cùng lúc không conflict
   - Review code dễ dàng
   - Onboarding nhanh cho member mới

6. **Performance**
   - Code splitting dễ dàng
   - Lazy loading từng feature
   - Bundle size nhỏ hơn

---

## 📦 Cách mở rộng thêm feature mới

### Ví dụ: Thêm feature "Reports" (Báo cáo)

1. **Tạo folder structure**:
```bash
src/features/reports/
├── components/
│   ├── ReportTable.tsx
│   ├── ReportFilters.tsx
│   └── ReportChart.tsx
├── hooks/
│   ├── useReports.ts
│   └── useReportExport.ts
├── services/
│   └── reportService.ts
├── types.ts
└── pages/
    └── ReportsPage.tsx
```

2. **Tạo types** (`features/reports/types.ts`):
```typescript
export interface Report {
  id: string;
  name: string;
  type: ReportType;
  createdAt: string;
  data: Record<string, unknown>;
}

export enum ReportType {
  ASSET_INVENTORY = 'Asset Inventory',
  MAINTENANCE_SUMMARY = 'Maintenance Summary',
  ALLOCATION_REPORT = 'Allocation Report',
}
```

3. **Tạo service** (`features/reports/services/reportService.ts`):
```typescript
import { Report } from '../types';

export const reportService = {
  getAll: (): Report[] => {
    // Logic lấy dữ liệu
    return [];
  },
  
  generateReport: (type: ReportType): Report => {
    // Logic tạo báo cáo
    return {} as Report;
  },
  
  exportToPDF: (reportId: string): void => {
    // Logic export PDF
  },
};
```

4. **Tạo custom hook** (`features/reports/hooks/useReports.ts`):
```typescript
import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Report } from '../types';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const data = reportService.getAll();
    setReports(data);
    setLoading(false);
  }, []);

  const generateReport = (type: ReportType) => {
    const newReport = reportService.generateReport(type);
    setReports(prev => [newReport, ...prev]);
  };

  return { reports, loading, generateReport };
};
```

5. **Tạo components**:
```typescript
// features/reports/components/ReportTable.tsx
interface ReportTableProps {
  reports: Report[];
  onExport: (id: string) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({ reports, onExport }) => {
  return (
    <Table>
      {/* Table implementation */}
    </Table>
  );
};
```

6. **Tạo page** (`features/reports/pages/ReportsPage.tsx`):
```typescript
import { useReports } from '../hooks/useReports';
import { ReportTable } from '../components/ReportTable';
import { ReportFilters } from '../components/ReportFilters';

export const ReportsPage: React.FC = () => {
  const { reports, loading, generateReport } = useReports();

  return (
    <div>
      <ReportFilters onGenerate={generateReport} />
      <ReportTable reports={reports} onExport={reportService.exportToPDF} />
    </div>
  );
};
```

7. **Thêm route** vào `App.tsx`:
```typescript
import { ReportsPage } from '@/features/reports/pages/ReportsPage';

// In Routes:
<Route path="/reports" element={<ReportsPage />} />
```

8. **Thêm menu item** vào `components/layout/Sidebar/NavigationMenu.tsx`:
```typescript
{
  path: '/reports',
  label: 'Báo cáo',
  icon: 'fa-chart-bar',
  roles: [UserRole.SYSTEM_ADMIN, UserRole.ASSET_MANAGER]
}
```

---

## 🔄 Migration Strategy

### Phase 1: Setup Structure
1. Tạo folder structure mới
2. Move shared components vào `components/ui/`
3. Tách Layout components

### Phase 2: Refactor Features (từng feature một)
1. Bắt đầu với feature đơn giản nhất
2. Tạo types.ts cho feature
3. Tạo services
4. Tạo custom hooks
5. Tạo components
6. Tạo page (compose components)
7. Test kỹ
8. Chuyển sang feature tiếp theo

### Phase 3: Cleanup
1. Xóa old files
2. Update imports
3. Update documentation

---

## 🎨 Code Style Guidelines

### 1. Component Structure
```typescript
// 1. Imports (external → internal → types)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAssets } from '../hooks/useAssets';
import type { Asset } from '../types';

// 2. Types/Interfaces
interface AssetTableProps {
  assets: Asset[];
  onSelect: (id: string) => void;
}

// 3. Component
export const AssetTable: React.FC<AssetTableProps> = ({ assets, onSelect }) => {
  // 3.1. Hooks
  const [selected, setSelected] = useState<string[]>([]);
  
  // 3.2. Event handlers
  const handleSelect = (id: string) => {
    setSelected(prev => [...prev, id]);
    onSelect(id);
  };
  
  // 3.3. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### 2. Hook Structure
```typescript
import { useState, useEffect } from 'react';
import { assetService } from '../services/assetService';
import type { Asset } from '../types';

export const useAssets = () => {
  // 1. State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Effects
  useEffect(() => {
    loadAssets();
  }, []);

  // 3. Functions
  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await assetService.getAll();
      setAssets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Return
  return { assets, loading, error, loadAssets };
};
```

### 3. Service Structure
```typescript
import type { Asset, CreateAssetDTO } from '../types';

export const assetService = {
  getAll: (): Asset[] => {
    // Implementation
    return [];
  },

  getById: (id: string): Asset | undefined => {
    // Implementation
    return undefined;
  },

  create: (dto: CreateAssetDTO): Asset => {
    // Implementation
    return {} as Asset;
  },

  update: (id: string, data: Partial<Asset>): Asset => {
    // Implementation
    return {} as Asset;
  },

  delete: (id: string): void => {
    // Implementation
  },
};
```

---

## 📚 Best Practices

### ✅ DO:
- Giữ components nhỏ và focused
- Sử dụng TypeScript strict mode
- Tạo types cho tất cả props, state, function parameters
- Extract logic vào custom hooks
- Reuse components từ `components/ui/`
- Comment cho logic phức tạp
- Validate input ở service layer

### ❌ DON'T:
- Không dùng `any` type
- Không hardcode values
- Không để logic business trong component
- Không duplicate code
- Không tạo component quá lớn (>300 lines)
- Không fetch data trong component
- Không mutate state trực tiếp

---

## 🧪 Testing Strategy

### Unit Tests
- Test từng function trong services
- Test custom hooks
- Test utility functions

### Integration Tests
- Test components với hooks
- Test pages với all dependencies

### E2E Tests
- Test user flows quan trọng
- Test critical paths

---

Cấu trúc này đảm bảo:
✅ Type-safe với TypeScript
✅ Scalable cho enterprise
✅ Easy to maintain
✅ Team-friendly
✅ Performance optimized
✅ Best practices
