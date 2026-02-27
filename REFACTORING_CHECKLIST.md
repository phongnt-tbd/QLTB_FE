# 🚀 Checklist Triển khai Feature-Based Architecture

## Phase 1: Chuẩn bị & Setup (2-3 giờ)

### ✅ 1.1. Tạo folder structure mới
```bash
# Trong src/
mkdir -p features/{assets,allocations,maintenance,transfers,departments,suppliers,categories,users,dashboard,auth,profile}/{components/modals,hooks,services,pages}
mkdir -p components/ui/{Button,Modal,Table,FormField,Pagination,Input,Select,SearchInput,FileUpload}
mkdir -p components/layout/{MainLayout,Header,Sidebar,Footer}
mkdir -p hooks
mkdir -p services/{localStorage,validation}
mkdir -p utils
```

### ✅ 1.2. Tạo shared UI components
- [ ] `Button` component với variants
- [ ] `Modal` component
- [ ] `Table` components (Table, TableRow, TableCell)
- [ ] `FormField` component
- [ ] `Pagination` component
- [ ] `Input` component
- [ ] `Select` component
- [ ] `SearchInput` component
- [ ] `FileUpload` component

### ✅ 1.3. Tạo Layout components
- [ ] Tách `Layout.tsx` thành:
  - [ ] `MainLayout.tsx` (wrapper)
  - [ ] `Header.tsx`
  - [ ] `Sidebar.tsx`
  - [ ] `NavigationMenu.tsx` (menu items)
  - [ ] `Footer.tsx` (nếu cần)

### ✅ 1.4. Tạo global hooks
- [ ] `useLocalStorage.ts`
- [ ] `usePagination.ts`
- [ ] `useDebounce.ts`
- [ ] `useToggle.ts`
- [ ] `useClickOutside.ts`

### ✅ 1.5. Tạo global services
- [ ] `localStorage/localStorageService.ts`
- [ ] `localStorage/storageKeys.ts`
- [ ] `validation/commonValidation.ts`

### ✅ 1.6. Tạo utils
- [ ] `utils/date.ts` (format date, calculate diff, etc.)
- [ ] `utils/format.ts` (format currency, number, etc.)
- [ ] `utils/string.ts` (capitalize, truncate, etc.)
- [ ] `utils/validation.ts`

---

## Phase 2: Refactor từng Feature (1 feature = 4-6 giờ)

### Thứ tự ưu tiên refactor:
1. ✅ **assets** (Đã có example)
2. **allocations**
3. **maintenance**
4. **transfers**
5. **departments**
6. **suppliers**
7. **categories**
8. **users**
9. **dashboard**
10. **auth**
11. **profile**

---

## 📋 Template cho mỗi feature

### Feature: [TÊN FEATURE]

#### ✅ Step 1: Tạo types.ts (30 phút)
- [ ] Đọc code cũ, identify tất cả types
- [ ] Tạo `features/[feature]/types.ts`
- [ ] Define interfaces cho:
  - [ ] Domain models (Entity types)
  - [ ] DTOs (Data Transfer Objects)
  - [ ] UI State types
  - [ ] Props types (nếu cần)
- [ ] Export tất cả types

**Checklist:**
```typescript
// ✅ Có interface cho main entity
export interface Asset { ... }

// ✅ Có DTOs cho actions
export interface CreateAssetDTO { ... }
export interface UpdateAssetDTO { ... }

// ✅ Có types cho UI state
export interface AssetFilters { ... }
export interface AssetStats { ... }

// ✅ Không dùng any
// ✅ Tất cả fields có type rõ ràng
```

---

#### ✅ Step 2: Tạo service layer (1-2 giờ)
- [ ] Tạo `features/[feature]/services/[feature]Service.ts`
- [ ] Extract tất cả business logic từ component cũ
- [ ] Tạo pure functions:
  - [ ] CRUD operations
  - [ ] Data transformations
  - [ ] Calculations
  - [ ] Validations
  - [ ] Filters

**Checklist:**
```typescript
export const [feature]Service = {
  // ✅ Create operations
  create: (dto: CreateDTO): Entity => { ... },
  
  // ✅ Read operations
  getAll: (): Entity[] => { ... },
  getById: (id: string): Entity | undefined => { ... },
  
  // ✅ Update operations
  update: (id: string, data: Partial<Entity>): Entity => { ... },
  
  // ✅ Delete operations
  delete: (id: string): void => { ... },
  
  // ✅ Business logic
  calculate...: (...) => { ... },
  validate...: (...): string[] => { ... },
  filter...: (...) => { ... },
  
  // ✅ All functions are pure (no side effects)
  // ✅ All functions have proper types
  // ✅ No React dependencies
};
```

---

#### ✅ Step 3: Tạo custom hooks (1-2 giờ)
- [ ] Tạo `features/[feature]/hooks/`
- [ ] Identify các nhóm logic:
  - [ ] Data fetching/mutations → `use[Feature].ts`
  - [ ] Filtering/searching → `use[Feature]Filters.ts`
  - [ ] Selection logic → `use[Feature]Selection.ts`
  - [ ] Actions → `use[Feature]Actions.ts`
  - [ ] Form handling → `use[Feature]Form.ts`
  - [ ] File upload → `useFileUpload.ts`

**Checklist mỗi hook:**
```typescript
export const use[Feature] = (...params) => {
  // ✅ State declarations (nếu cần)
  const [data, setData] = useState(...);
  
  // ✅ Effects (nếu cần)
  useEffect(() => { ... }, [deps]);
  
  // ✅ Memoized values
  const computed = useMemo(() => { ... }, [deps]);
  
  // ✅ Event handlers
  const handleSomething = (...) => { ... };
  
  // ✅ Return object with clear naming
  return { 
    // Data
    data,
    loading,
    error,
    
    // Computed
    computed,
    
    // Actions
    handleSomething,
  };
};

// ✅ No business logic (đã move sang service)
// ✅ Proper dependency arrays
// ✅ Return type defined
```

---

#### ✅ Step 4: Tạo UI components (2-3 giờ)
- [ ] Tạo `features/[feature]/components/`
- [ ] Tách component lớn thành nhiều components nhỏ:
  - [ ] List/Table component
  - [ ] Card/Item component
  - [ ] Filter component
  - [ ] Action bar component
  - [ ] Stats component
  - [ ] Form components
- [ ] Tạo `components/modals/` cho modals

**Checklist mỗi component:**
```typescript
interface ComponentProps {
  // ✅ All props have types
  data: SomeType[];
  onAction: (id: string) => void;
  // ✅ Optional props có ?
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({ data, onAction }) => {
  // ✅ No useState (trừ UI state như hover, focus)
  // ✅ No useEffect (trừ DOM manipulation)
  // ✅ No business logic
  // ✅ No API calls
  
  // ✅ Only render logic
  return (
    <div>
      {data.map(item => (
        <button onClick={() => onAction(item.id)}>
          {item.name}
        </button>
      ))}
    </div>
  );
};

// ✅ Component < 200 lines
// ✅ Single responsibility
// ✅ Props documented with types
```

---

#### ✅ Step 5: Tạo Page component (30 phút - 1 giờ)
- [ ] Tạo `features/[feature]/pages/[Feature]Page.tsx`
- [ ] Page chỉ làm:
  - [ ] Import hooks
  - [ ] Import components
  - [ ] Compose UI
  - [ ] Pass props

**Checklist:**
```typescript
export const [Feature]Page: React.FC<Props> = ({ ... }) => {
  // ✅ Modal states only
  const [isModalOpen, setModalOpen] = useState(false);
  
  // ✅ Use custom hooks
  const { data, loading } = use[Feature]();
  const { filters, ... } = use[Feature]Filters();
  const { selected, ... } = use[Feature]Selection();
  
  // ✅ Simple event handlers (just call hook functions)
  const handleCreate = (dto) => {
    create(dto);
    setModalOpen(false);
  };
  
  // ✅ Compose UI from components
  return (
    <div>
      <StatsComponent stats={stats} />
      <FiltersComponent filters={filters} onChange={updateFilters} />
      <TableComponent data={data} onSelect={select} />
      <CreateModal isOpen={isModalOpen} onSubmit={handleCreate} />
    </div>
  );
};

// ✅ Page < 200 lines
// ✅ No business logic
// ✅ Just composition
```

---

#### ✅ Step 6: Update routing (15 phút)
- [ ] Import page vào `App.tsx`
- [ ] Update route
- [ ] Test navigation

```typescript
import { [Feature]Page } from '@/features/[feature]/pages/[Feature]Page';

// In Routes:
<Route 
  path="/[feature]" 
  element={<[Feature]Page ... />} 
/>
```

---

#### ✅ Step 7: Testing (1-2 giờ)
- [ ] Test service functions
- [ ] Test custom hooks
- [ ] Test components
- [ ] Test page integration
- [ ] Manual testing UI

**Test checklist:**
```typescript
// ✅ Service tests
describe('[feature]Service', () => {
  it('should create entity correctly', () => { ... });
  it('should validate input', () => { ... });
});

// ✅ Hook tests
describe('use[Feature]', () => {
  it('should filter data', () => { ... });
  it('should handle selection', () => { ... });
});

// ✅ Component tests
describe('[Feature]Table', () => {
  it('should render items', () => { ... });
  it('should call onSelect', () => { ... });
});
```

---

#### ✅ Step 8: Cleanup (30 phút)
- [ ] Xóa component cũ (sau khi confirm mọi thứ work)
- [ ] Update imports
- [ ] Remove unused code
- [ ] Format code
- [ ] Commit changes

---

## Phase 3: Polish & Optimization (2-4 giờ)

### ✅ 3.1. Code Quality
- [ ] Run linter và fix errors
- [ ] Add JSDoc comments cho functions phức tạp
- [ ] Remove console.logs
- [ ] Remove commented code
- [ ] Check for hardcoded values

### ✅ 3.2. Performance
- [ ] Check useMemo/useCallback usage
- [ ] Implement React.memo cho expensive components
- [ ] Check re-render issues
- [ ] Optimize bundle size

### ✅ 3.3. Accessibility
- [ ] Add ARIA labels
- [ ] Check keyboard navigation
- [ ] Check screen reader compatibility

### ✅ 3.4. Documentation
- [ ] Update README
- [ ] Document complex logic
- [ ] Add usage examples
- [ ] Update API documentation

---

## 📊 Progress Tracking

### Features Status

| Feature | Types | Service | Hooks | Components | Page | Route | Tests | Status |
|---------|-------|---------|-------|------------|------|-------|-------|--------|
| assets | ✅ | ✅ | ✅ | ✅ | ✅ | ⏸️ | ⏸️ | 📝 Example |
| allocations | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |
| maintenance | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |
| transfers | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |
| departments | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |
| suppliers | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |
| categories | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |
| users | ✅ | ⏸️ | ⏸️ | ✅ | ✅ | ⏸️ | ⏸️ | 🔄 Partial |
| dashboard | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |
| auth | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |
| profile | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏸️ | ⏳ Todo |

Legend:
- ✅ Done
- 🔄 In Progress
- ⏸️ Not Started
- ⏳ Todo

---

## 🎯 Ước tính thời gian

### Tổng quan:
- **Phase 1 (Setup)**: 2-3 giờ
- **Phase 2 (Refactor 1 feature)**: 4-6 giờ
- **Phase 2 (Tất cả 11 features)**: 44-66 giờ (~1-1.5 tuần)
- **Phase 3 (Polish)**: 2-4 giờ

**Total**: ~50-75 giờ (1.5-2 tuần với 1 developer)

### Parallel work (nếu có team):
- Developer 1: Features 1-4
- Developer 2: Features 5-8
- Developer 3: Features 9-11 + Shared components

→ Có thể giảm xuống **3-5 ngày** với 3 developers

---

## ⚠️ Common Pitfalls & Solutions

### 1. Over-abstraction
❌ **Problem**: Tạo quá nhiều small components/hooks không cần thiết
✅ **Solution**: Chỉ tách khi:
- Component > 200 lines
- Logic được reuse > 2 lần
- Logic phức tạp cần test riêng

### 2. Tight coupling
❌ **Problem**: Components depend trực tiếp vào nhau
✅ **Solution**: 
- Pass data qua props
- Use callbacks cho communication
- Shared state ở parent

### 3. Type inconsistency
❌ **Problem**: Some files có types, some không
✅ **Solution**:
- Bật TypeScript strict mode
- No `any` allowed
- Review checklist cho types

### 4. Missing tests
❌ **Problem**: Không viết tests
✅ **Solution**:
- Viết tests cho service layer (must have)
- Tests cho hooks (nice to have)
- Tests cho critical components

### 5. Poor naming
❌ **Problem**: Tên không rõ ràng (e.g., `handleClick`, `data1`, `temp`)
✅ **Solution**:
- Use descriptive names
- Follow naming conventions
- Review naming trong checklist

---

## 📚 Resources

### Documentation
- [ ] `REFACTORING_GUIDE.md` - Cấu trúc & nguyên tắc
- [ ] `REFACTORING_EXAMPLE.md` - Example chi tiết với AssetManagement
- [ ] `REFACTORING_CHECKLIST.md` - Checklist này

### Code Examples
- [ ] `features/assets/` - Complete example
- [ ] `components/ui/Button/` - Shared component example
- [ ] `components/ui/Modal/` - Modal example

### Templates
Có thể tạo thêm templates cho:
- [ ] Feature folder structure script
- [ ] Component template
- [ ] Hook template
- [ ] Service template
- [ ] Test template

---

## 🚀 Getting Started

1. **Đọc tài liệu:**
   - `REFACTORING_GUIDE.md` - Hiểu architecture
   - `REFACTORING_EXAMPLE.md` - Xem example chi tiết

2. **Setup Phase 1:**
   - Tạo folder structure
   - Tạo shared components
   - Tạo global hooks/utils

3. **Chọn feature đầu tiên:**
   - Đề xuất: Bắt đầu với feature đơn giản nhất (ví dụ: categories, suppliers)
   - Hoặc follow example: assets (đã có sẵn)

4. **Follow checklist cho từng feature**

5. **Iterate:**
   - Complete 1 feature
   - Review code
   - Fix issues
   - Move to next feature

---

## ✅ Definition of Done cho mỗi feature

Feature được coi là "Done" khi:

- [ ] ✅ Tất cả types defined (no `any`)
- [ ] ✅ Service layer created với pure functions
- [ ] ✅ Custom hooks extracted business logic
- [ ] ✅ Components < 200 lines each
- [ ] ✅ Page component chỉ compose UI
- [ ] ✅ Route updated
- [ ] ✅ Tests written (ít nhất service layer)
- [ ] ✅ Manual testing passed
- [ ] ✅ No console errors
- [ ] ✅ No linter errors
- [ ] ✅ Code reviewed
- [ ] ✅ Documentation updated
- [ ] ✅ Old code removed

---

Good luck! 🚀
