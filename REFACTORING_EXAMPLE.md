# Feature-Based Architecture - Asset Management Example

## 📂 Cấu trúc đã refactor

Đây là ví dụ hoàn chỉnh của feature **AssetManagement** đã được refactor theo feature-based architecture.

### Cấu trúc folder

```
src/features/assets/
├── components/
│   ├── AssetTable.tsx              # Bảng hiển thị assets
│   ├── AssetStatsCards.tsx         # Cards hiển thị thống kê
│   ├── AssetFilters.tsx            # Bộ lọc tìm kiếm
│   ├── AssetActionBar.tsx          # Thanh action buttons
│   └── modals/
│       └── ImportAssetModal.tsx    # Modal nhập tài sản
│
├── hooks/
│   ├── useAssetFilters.ts          # Logic filtering & stats
│   ├── useAssetSelection.ts        # Logic chọn items
│   ├── useAssetActions.ts          # Logic thao tác assets
│   └── useFileUpload.ts            # Logic upload file
│
├── services/
│   └── assetService.ts             # Business logic & transformations
│
├── types.ts                        # Types cho feature
└── pages/
    └── AssetManagementPage.tsx     # Main page (chỉ compose UI)
```

---

## 🎯 So sánh Before/After

### ❌ BEFORE (Old AssetManagement.tsx - 910 lines)

**Vấn đề:**
- ❌ File quá lớn (910 dòng)
- ❌ Tất cả logic trong 1 component
- ❌ Khó test, khó maintain
- ❌ Không reuse được code
- ❌ State management phức tạp
- ❌ UI và logic lẫn lộn

```typescript
// AssetManagement.tsx (910 lines) - TOO BIG!
const AssetManagement: React.FC<AssetManagementProps> = ({ ... }) => {
  // 30+ useState hooks
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // ... many more states
  
  // Business logic mixed with UI
  const allItems = useMemo(() => {
    return assets.flatMap(batch => ...);
  }, [assets]);
  
  const filteredItems = allItems.filter(item => {
    // Complex filtering logic
  });
  
  // Event handlers
  const handleImport = (e) => { /* 50+ lines */ };
  const handleRetireSubmit = (e) => { /* 30+ lines */ };
  // ... many more handlers
  
  // HUGE JSX (600+ lines)
  return (
    <div>
      {/* Stats Cards */}
      {/* Filters */}
      {/* Action Bar */}
      {/* Table (200+ lines) */}
      {/* 7 Modals (400+ lines) */}
    </div>
  );
};
```

---

### ✅ AFTER (Refactored - Tách thành nhiều files nhỏ)

#### 1. **Page Component** (AssetManagementPage.tsx - ~150 lines)
**Chỉ làm:** Compose UI, không có logic

```typescript
export const AssetManagementPage: React.FC<Props> = ({ ... }) => {
  // Modal states
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  
  // Custom hooks (tách logic ra ngoài)
  const { filters, filteredItems, stats, updateSearch, ... } = useAssetFilters(assets);
  const { selectedIds, canBulkAllocate, ... } = useAssetSelection(filteredItems);
  const { allocateAssets, recoverAssets, ... } = useAssetActions(assets, setAssets);
  
  // Chỉ còn JSX sạch sẽ
  return (
    <div>
      <AssetStatsCards stats={stats} />
      <AssetFilters ... />
      <AssetActionBar ... />
      <AssetTable ... />
      <ImportAssetModal ... />
    </div>
  );
};
```

**✅ Ưu điểm:**
- Page component chỉ ~150 lines
- Logic tách ra hooks
- UI tách ra components
- Dễ đọc, dễ hiểu

---

#### 2. **Custom Hooks** (Tách logic business)

**useAssetFilters.ts** (~60 lines)
```typescript
export const useAssetFilters = (assets: Asset[]) => {
  const [filters, setFilters] = useState<AssetFilters>({ ... });
  
  const allItems = useMemo(() => 
    assetService.flattenAssets(assets), 
    [assets]
  );
  
  const filteredItems = useMemo(() => 
    assetService.filterAssets(allItems, filters.search, ...),
    [allItems, filters]
  );
  
  const stats = useMemo(() => 
    assetService.getAssetStats(allItems),
    [allItems]
  );
  
  return { filters, allItems, filteredItems, stats, updateSearch, ... };
};
```

**✅ Ưu điểm:**
- Tách logic filtering & stats
- Có thể test riêng
- Reuse ở nhiều nơi

---

**useAssetSelection.ts** (~80 lines)
```typescript
export const useAssetSelection = (filteredItems: AssetWithParent[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const selectedItems = useMemo(() => 
    filteredItems.filter(item => selectedIds.includes(item.id)),
    [filteredItems, selectedIds]
  );
  
  // Business rules
  const canBulkAllocate = useMemo(() => 
    selectedItems.length > 0 && 
    selectedItems.every(i => i.status === AssetItemStatus.IN_STOCK),
    [selectedItems]
  );
  
  return { selectedIds, canBulkAllocate, toggleSelect, ... };
};
```

**✅ Ưu điểm:**
- Tách logic selection
- Business rules rõ ràng
- Easy to test

---

**useAssetActions.ts** (~90 lines)
```typescript
export const useAssetActions = (assets, setAssets) => {
  const allocateAssets = (dto: AllocateAssetDTO, departmentName: string) => {
    const updatedAssets = assetService.updateItemsStatus(
      assets, dto.itemIds, AssetItemStatus.ALLOCATED, { ... }
    );
    setAssets(updatedAssets);
  };
  
  return { allocateAssets, recoverAssets, transferAssets, ... };
};
```

**✅ Ưu điểm:**
- Tất cả actions ở 1 chỗ
- Type-safe với DTO
- Dễ extend thêm actions

---

#### 3. **Service Layer** (assetService.ts - ~150 lines)

```typescript
export const assetService = {
  generateBatchCode: (): string => { ... },
  
  generateItems: (batchId, batchCode, quantity): AssetItem[] => { ... },
  
  createAsset: (dto: CreateAssetDTO): Asset => { ... },
  
  flattenAssets: (assets: Asset[]): AssetWithParent[] => { ... },
  
  updateItemsStatus: (assets, itemIds, newStatus, extraData, historyEvent) => { ... },
  
  validateCreateAsset: (dto: Partial<CreateAssetDTO>): string[] => { ... },
  
  filterAssets: (items, search, statusFilter, categoryFilter) => { ... },
  
  getAssetStats: (items) => ({ total, inStock, allocated, ... }),
};
```

**✅ Ưu điểm:**
- Pure functions (dễ test)
- Business logic tập trung
- Không depend vào React
- Reusable

---

#### 4. **UI Components** (Tách thành nhiều components nhỏ)

**AssetStatsCards.tsx** (~40 lines)
```typescript
export const AssetStatsCards: React.FC<{ stats: AssetStats }> = ({ stats }) => {
  const cards = [
    { label: 'Tổng tài sản', value: stats.total, color: 'text-slate-900' },
    // ...
  ];
  
  return (
    <div className="grid grid-cols-5 gap-4">
      {cards.map(card => (
        <div key={card.label}>...</div>
      ))}
    </div>
  );
};
```

**AssetFilters.tsx** (~60 lines)
```typescript
export const AssetFilters: React.FC<Props> = ({ 
  search, statusFilter, categories, onSearchChange, ... 
}) => {
  return (
    <div className="flex gap-4">
      <input value={search} onChange={e => onSearchChange(e.target.value)} />
      <select value={categoryFilter} onChange={...}>...</select>
      <select value={statusFilter} onChange={...}>...</select>
    </div>
  );
};
```

**AssetTable.tsx** (~150 lines)
```typescript
export const AssetTable: React.FC<Props> = ({ 
  items, selectedIds, departments, onToggleSelect, ... 
}) => {
  return (
    <table>
      <thead>...</thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>...</tr>
        ))}
      </tbody>
    </table>
  );
};
```

**✅ Ưu điểm:**
- Mỗi component < 200 lines
- Single responsibility
- Props rõ ràng với types
- Dễ test từng component

---

#### 5. **Types** (types.ts)

```typescript
// Feature-specific types
export interface Asset { ... }
export interface AssetItem { ... }
export interface AssetWithParent extends AssetItem { ... }

// DTOs (Data Transfer Objects)
export interface CreateAssetDTO { ... }
export interface AllocateAssetDTO { ... }
export interface MaintenanceDTO { ... }

// UI State types
export interface AssetFilters { ... }
export interface AssetStats { ... }
```

**✅ Ưu điểm:**
- Type-safe 100%
- Không dùng `any`
- DTO pattern rõ ràng
- Easy to maintain

---

## 📊 Metrics Comparison

### Before:
```
AssetManagement.tsx
├── Lines: 910
├── Complexity: Very High
├── Testability: Hard
├── Reusability: Low
└── Maintainability: Poor
```

### After:
```
features/assets/
├── AssetManagementPage.tsx     (~150 lines) ⬇️ 83%
├── AssetTable.tsx              (~150 lines)
├── AssetStatsCards.tsx         (~40 lines)
├── AssetFilters.tsx            (~60 lines)
├── AssetActionBar.tsx          (~80 lines)
├── ImportAssetModal.tsx        (~150 lines)
├── useAssetFilters.ts          (~60 lines)
├── useAssetSelection.ts        (~80 lines)
├── useAssetActions.ts          (~90 lines)
├── useFileUpload.ts            (~50 lines)
├── assetService.ts             (~150 lines)
└── types.ts                    (~100 lines)
────────────────────────────────────────────
Total: ~1160 lines (distributed across 12 files)
Average per file: ~96 lines ✅
```

**✅ Kết quả:**
- ✅ Mỗi file < 200 lines (dễ đọc)
- ✅ Separation of Concerns
- ✅ Testability: Excellent
- ✅ Reusability: High
- ✅ Maintainability: Excellent

---

## 🧪 Testing Strategy

### 1. Test Service Layer
```typescript
// assetService.test.ts
describe('assetService', () => {
  describe('createAsset', () => {
    it('should create asset with correct structure', () => {
      const dto: CreateAssetDTO = { ... };
      const asset = assetService.createAsset(dto);
      
      expect(asset.id).toBeDefined();
      expect(asset.batchCode).toMatch(/UNI-\d{4}-\d{2}-\d{3}/);
      expect(asset.items).toHaveLength(dto.quantity);
    });
  });
  
  describe('validateCreateAsset', () => {
    it('should return errors for invalid data', () => {
      const errors = assetService.validateCreateAsset({ name: '' });
      expect(errors).toContain('Tên tài sản không được để trống');
    });
  });
});
```

### 2. Test Custom Hooks
```typescript
// useAssetFilters.test.ts
import { renderHook } from '@testing-library/react-hooks';

describe('useAssetFilters', () => {
  it('should filter assets by search term', () => {
    const { result } = renderHook(() => useAssetFilters(mockAssets));
    
    act(() => {
      result.current.updateSearch('laptop');
    });
    
    expect(result.current.filteredItems).toHaveLength(5);
  });
});
```

### 3. Test Components
```typescript
// AssetTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';

describe('AssetTable', () => {
  it('should render items correctly', () => {
    render(<AssetTable items={mockItems} ... />);
    
    expect(screen.getByText('UNI-2024-01-001')).toBeInTheDocument();
  });
  
  it('should call onToggleSelect when checkbox clicked', () => {
    const onToggleSelect = jest.fn();
    render(<AssetTable onToggleSelect={onToggleSelect} ... />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggleSelect).toHaveBeenCalledWith('item-1');
  });
});
```

---

## 🔄 Cách sử dụng

### 1. Import vào App.tsx

```typescript
import { AssetManagementPage } from '@/features/assets/pages/AssetManagementPage';

// In Routes:
<Route 
  path="/assets" 
  element={
    <AssetManagementPage
      assets={assets}
      setAssets={setAssets}
      departments={departments}
      suppliers={suppliers}
      categories={categories}
    />
  } 
/>
```

### 2. Reuse components trong features khác

```typescript
// Trong feature khác có thể reuse
import { AssetTable } from '@/features/assets/components/AssetTable';
import { assetService } from '@/features/assets/services/assetService';
```

### 3. Extend functionality

**Thêm action mới:**
```typescript
// useAssetActions.ts
export const useAssetActions = (assets, setAssets) => {
  // ... existing actions
  
  // ✅ Thêm action mới
  const duplicateAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;
    
    const newAsset = assetService.createAsset({
      ...asset,
      quantity: asset.totalQuantity,
    });
    
    setAssets(prev => [newAsset, ...prev]);
  };
  
  return { 
    allocateAssets, 
    recoverAssets, 
    duplicateAsset // ✅ Export
  };
};
```

---

## 📈 Khi nào nên refactor?

### ⚠️ Warning Signs (Cần refactor):
- ❌ Component > 300 lines
- ❌ Quá nhiều useState (> 10)
- ❌ Logic business trong component
- ❌ Khó test
- ❌ Khó hiểu code sau 1 tuần
- ❌ Copy-paste code nhiều

### ✅ After Refactor:
- ✅ Mỗi file < 200 lines
- ✅ Logic tách ra hooks/services
- ✅ Components thuần UI
- ✅ Dễ test (có thể test từng phần)
- ✅ Code tự document
- ✅ DRY (Don't Repeat Yourself)

---

## 🎓 Best Practices Applied

1. **Single Responsibility Principle**
   - Mỗi file/function chỉ làm 1 việc

2. **Separation of Concerns**
   - UI ≠ Logic
   - Pages ≠ Components
   - Hooks ≠ Services

3. **Type Safety**
   - TypeScript strict mode
   - Không dùng `any`
   - DTO pattern

4. **Clean Code**
   - Tên biến/function rõ ràng
   - Pure functions khi có thể
   - Immutability

5. **Scalability**
   - Feature-based structure
   - Easy to add new features
   - No tight coupling

---

## 🚀 Next Steps

Áp dụng pattern này cho các features khác:
1. ✅ **assets** (Done - example này)
2. **allocations** (Next)
3. **maintenance**
4. **transfers**
5. **departments**
6. **suppliers**
7. **categories**
8. **users**
9. **dashboard**
10. **auth**

Mỗi feature đều follow cùng structure!
