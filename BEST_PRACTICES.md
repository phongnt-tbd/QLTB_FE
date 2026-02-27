# 🎓 Best Practices & Tips for Feature-Based Architecture

## 🎯 Core Principles

### 1. Single Responsibility Principle (SRP)
**Mỗi file/function chỉ làm một việc**

❌ **Bad:**
```typescript
// UserComponent.tsx - làm quá nhiều việc
const UserComponent = () => {
  // Fetch data
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch('/api/users').then(res => res.json()).then(setUsers);
  }, []);
  
  // Filter logic
  const [search, setSearch] = useState('');
  const filtered = users.filter(u => u.name.includes(search));
  
  // Selection logic
  const [selected, setSelected] = useState([]);
  
  // Business logic
  const handleDelete = (id) => { /* complex logic */ };
  
  // UI rendering (200+ lines)
  return <div>...</div>;
};
```

✅ **Good:**
```typescript
// UserPage.tsx - chỉ compose
const UserPage = () => {
  const { users, loading } = useUsers();
  const { filtered, search, setSearch } = useUserFilters(users);
  const { selected, toggleSelect } = useUserSelection();
  const { deleteUser } = useUserActions();
  
  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />
      <UserTable users={filtered} onSelect={toggleSelect} />
    </div>
  );
};
```

---

### 2. Separation of Concerns

**Tách biệt UI, Logic, và Data**

```
📦 Feature
├── 🎨 Components (UI only)
│   └── Nhận props, render UI, no logic
├── 🧠 Hooks (Business logic)
│   └── State management, side effects
├── 💾 Services (Data layer)
│   └── Pure functions, transformations
└── 📝 Types (Type definitions)
```

❌ **Bad:** UI + Logic + Data lẫn lộn
```typescript
const Component = () => {
  const [data, setData] = useState([]);
  
  // ❌ API call trong component
  useEffect(() => {
    fetch('/api/data').then(res => {
      // ❌ Transform data trong component
      const transformed = res.data.map(item => ({
        ...item,
        fullName: `${item.firstName} ${item.lastName}`
      }));
      setData(transformed);
    });
  }, []);
  
  // ❌ Business logic trong component
  const calculate = (item) => {
    return item.price * item.quantity * (1 - item.discount);
  };
  
  return <div>{data.map(item => ...)}</div>;
};
```

✅ **Good:** Tách rõ ràng
```typescript
// Service (Data layer)
const dataService = {
  fetchData: async () => { /* API call */ },
  transformData: (data) => { /* Transform */ },
  calculateTotal: (item) => { /* Business logic */ },
};

// Hook (Logic layer)
const useData = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    dataService.fetchData().then(raw => {
      const transformed = dataService.transformData(raw);
      setData(transformed);
    });
  }, []);
  
  return { data };
};

// Component (UI layer)
const Component = () => {
  const { data } = useData();
  return <div>{data.map(item => ...)}</div>;
};
```

---

### 3. DRY (Don't Repeat Yourself)

❌ **Bad:** Duplicate code
```typescript
// Feature A
const FeatureA = () => {
  const [search, setSearch] = useState('');
  const filtered = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  // ...
};

// Feature B
const FeatureB = () => {
  const [search, setSearch] = useState('');
  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  // ...
};
```

✅ **Good:** Reusable hook
```typescript
// hooks/useSearch.ts
export const useSearch = <T>(
  data: T[], 
  searchFields: (keyof T)[]
) => {
  const [search, setSearch] = useState('');
  
  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter(item =>
      searchFields.some(field => 
        String(item[field]).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search, searchFields]);
  
  return { search, setSearch, filtered };
};

// Usage
const FeatureA = () => {
  const { search, setSearch, filtered } = useSearch(data, ['name', 'email']);
};

const FeatureB = () => {
  const { search, setSearch, filtered } = useSearch(items, ['title', 'description']);
};
```

---

## 🔧 Practical Tips

### 1. Component Size Rule
**Giới hạn kích thước files**

```typescript
// ✅ Good sizes:
// - Components: < 200 lines
// - Hooks: < 150 lines
// - Services: < 300 lines
// - Types: < 200 lines

// ⚠️ If file > 300 lines → Tách nhỏ ra!
```

### 2. Props Drilling Solution
**Tránh pass props qua nhiều layers**

❌ **Bad:** Props drilling
```typescript
const App = () => {
  const [user, setUser] = useState();
  return <PageA user={user} />;
};

const PageA = ({ user }) => {
  return <ComponentB user={user} />;
};

const ComponentB = ({ user }) => {
  return <ComponentC user={user} />;
};

const ComponentC = ({ user }) => {
  return <div>{user.name}</div>; // Chỉ dùng ở đây!
};
```

✅ **Good:** Use Context hoặc pass qua route
```typescript
// app/providers/UserContext.tsx
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// hooks/useUser.ts
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

// Anywhere in app:
const ComponentC = () => {
  const { user } = useUser();
  return <div>{user.name}</div>;
};
```

---

### 3. Type-Safe Event Handlers

❌ **Bad:** Loose typing
```typescript
const handleSubmit = (e: any) => { // ❌ any
  const value = e.target.value; // ❌ No autocomplete
};
```

✅ **Good:** Proper typing
```typescript
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value; // ✅ Full autocomplete
};

const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
};

const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  // ...
};
```

---

### 4. Conditional Rendering Best Practices

❌ **Bad:** Nhiều ternary lồng nhau
```typescript
return (
  <div>
    {loading ? (
      <Spinner />
    ) : error ? (
      <Error message={error} />
    ) : data ? (
      data.length > 0 ? (
        <List items={data} />
      ) : (
        <Empty />
      )
    ) : (
      <Initial />
    )}
  </div>
);
```

✅ **Good:** Early returns
```typescript
if (loading) return <Spinner />;
if (error) return <Error message={error} />;
if (!data) return <Initial />;
if (data.length === 0) return <Empty />;

return <List items={data} />;
```

✅ **Good:** Extract to component
```typescript
const DataDisplay = ({ loading, error, data }) => {
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  if (!data || data.length === 0) return <Empty />;
  return <List items={data} />;
};
```

---

### 5. Performance Optimization

**useMemo vs useCallback**

```typescript
// ✅ useMemo: For expensive calculations
const expensiveValue = useMemo(() => {
  return data.filter(item => item.price > 1000)
             .map(item => ({ ...item, tax: item.price * 0.1 }))
             .sort((a, b) => b.price - a.price);
}, [data]);

// ✅ useCallback: For stable function references
const handleClick = useCallback((id: string) => {
  // Function được memoize, không recreate mỗi render
  console.log('Clicked:', id);
}, []);

// ✅ React.memo: For expensive components
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Chỉ re-render khi props thay đổi
  return <div>...</div>;
});
```

**When to use:**
- ✅ Use `useMemo`: Khi calculation cost > memory cost
- ✅ Use `useCallback`: Khi pass function to child components
- ✅ Use `React.memo`: Khi component render cost cao
- ❌ Don't: Over-optimize, premature optimization

---

### 6. Error Handling

❌ **Bad:** Silent errors
```typescript
const fetchData = async () => {
  try {
    const res = await fetch('/api/data');
    return res.json();
  } catch (err) {
    // ❌ Silent fail
  }
};
```

✅ **Good:** Proper error handling
```typescript
const fetchData = async () => {
  try {
    const res = await fetch('/api/data');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error('Failed to fetch data:', err);
    throw err; // Re-throw để caller handle
  }
};

// Hook with error state
const useData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetchData()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);
  
  return { data, error, loading };
};
```

---

### 7. Form Handling

❌ **Bad:** Controlled components cho large forms
```typescript
const Form = () => {
  // ❌ Too many useState, re-render mỗi keystroke
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // ... 20 more fields
};
```

✅ **Good:** FormData hoặc useRef
```typescript
const Form = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    // { name: '...', email: '...', phone: '...' }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <input name="phone" />
      <button type="submit">Submit</button>
    </form>
  );
};
```

✅ **Good:** React Hook Form (for complex forms)
```typescript
import { useForm } from 'react-hook-form';

const Form = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      {errors.name && <span>This field is required</span>}
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

### 8. Loading States

✅ **Good pattern:**
```typescript
// types.ts
type AsyncState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// Hook
const useAsyncData = <T>() => {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });
  
  const execute = async (promise: Promise<T>) => {
    setState({ status: 'loading' });
    try {
      const data = await promise;
      setState({ status: 'success', data });
    } catch (error) {
      setState({ status: 'error', error: error.message });
    }
  };
  
  return { state, execute };
};

// Component
const Component = () => {
  const { state, execute } = useAsyncData<User[]>();
  
  useEffect(() => {
    execute(fetchUsers());
  }, []);
  
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'error':
      return <Error message={state.error} />;
    case 'success':
      return <List users={state.data} />;
  }
};
```

---

## 🎨 Styling Best Practices

### 1. Consistent Class Naming

```typescript
// ✅ Use Tailwind consistently
const Button = ({ variant = 'primary' }) => {
  const baseClass = 'px-4 py-2 rounded-lg font-bold transition-all';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  return (
    <button className={`${baseClass} ${variants[variant]}`}>
      Click me
    </button>
  );
};
```

### 2. Responsive Design

```typescript
// ✅ Mobile-first approach
const Card = () => (
  <div className="
    w-full              /* Mobile: full width */
    md:w-1/2            /* Tablet: half width */
    lg:w-1/3            /* Desktop: third width */
    p-4                 /* Mobile: padding 1rem */
    md:p-6              /* Tablet+: padding 1.5rem */
  ">
    ...
  </div>
);
```

---

## 🧪 Testing Tips

### 1. Test Structure

```typescript
describe('ComponentName', () => {
  // ✅ Group related tests
  describe('rendering', () => {
    it('should render with default props', () => {});
    it('should render with custom props', () => {});
  });
  
  describe('interactions', () => {
    it('should call onClick when clicked', () => {});
    it('should update state on input change', () => {});
  });
  
  describe('edge cases', () => {
    it('should handle empty data', () => {});
    it('should handle errors', () => {});
  });
});
```

### 2. Test What Matters

```typescript
// ✅ Test user behavior, not implementation
it('should add item to cart', () => {
  render(<ProductCard product={mockProduct} />);
  
  // ✅ User sees button
  const button = screen.getByRole('button', { name: /add to cart/i });
  
  // ✅ User clicks
  fireEvent.click(button);
  
  // ✅ User sees result
  expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
});

// ❌ Don't test implementation details
it('should call setState', () => {
  // ❌ Bad: testing internal state
  expect(component.state.count).toBe(1);
});
```

---

## 🚀 Performance Tips

### 1. Code Splitting

```typescript
// ✅ Lazy load routes
import { lazy, Suspense } from 'react';

const AssetPage = lazy(() => import('@/features/assets/pages/AssetManagementPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));

// In Routes:
<Route 
  path="/assets" 
  element={
    <Suspense fallback={<Spinner />}>
      <AssetPage />
    </Suspense>
  } 
/>
```

### 2. Optimize Images

```typescript
// ✅ Use proper image formats
<img 
  src="image.webp" 
  loading="lazy"     // Lazy load
  width={300}        // Explicit dimensions
  height={200}
  alt="Description"
/>
```

### 3. Avoid Re-renders

```typescript
// ❌ Bad: Creates new object every render
const Component = () => {
  const style = { color: 'red' }; // ❌ New object
  return <div style={style}>Text</div>;
};

// ✅ Good: Stable reference
const style = { color: 'red' }; // ✅ Outside component

const Component = () => {
  return <div style={style}>Text</div>;
};

// ✅ Good: useMemo for dynamic
const Component = ({ color }) => {
  const style = useMemo(() => ({ color }), [color]);
  return <div style={style}>Text</div>;
};
```

---

## 📚 Code Review Checklist

### Before submitting PR:

#### Code Quality
- [ ] No `any` types
- [ ] No `console.log` left
- [ ] No commented code
- [ ] No hardcoded values
- [ ] Proper error handling
- [ ] Meaningful variable names

#### Architecture
- [ ] Components < 200 lines
- [ ] Hooks < 150 lines
- [ ] Services are pure functions
- [ ] Proper separation of concerns
- [ ] No circular dependencies

#### TypeScript
- [ ] All props typed
- [ ] All functions have return types
- [ ] DTOs defined
- [ ] Enums for constants

#### Performance
- [ ] Proper useMemo/useCallback
- [ ] No unnecessary re-renders
- [ ] Lazy loading where needed

#### Testing
- [ ] Unit tests for services
- [ ] Component tests for critical components
- [ ] No failing tests

#### Documentation
- [ ] Complex logic documented
- [ ] README updated
- [ ] Types documented

---

## 🎓 Learning Resources

### Recommended Reading:
1. **Clean Code** by Robert C. Martin
2. **Refactoring** by Martin Fowler
3. **React Patterns** - patterns.dev/react
4. **TypeScript Deep Dive** - basarat.gitbook.io/typescript

### Tools:
- ESLint + Prettier for code formatting
- TypeScript strict mode
- React DevTools for debugging
- Bundle analyzer for optimization

---

## 💡 Quick Wins

### Immediate improvements you can make:

1. **Extract magic numbers**
   ```typescript
   // ❌ Bad
   if (items.length > 10) { ... }
   
   // ✅ Good
   const MAX_ITEMS_PER_PAGE = 10;
   if (items.length > MAX_ITEMS_PER_PAGE) { ... }
   ```

2. **Use constants for strings**
   ```typescript
   // ❌ Bad
   if (status === 'pending') { ... }
   
   // ✅ Good
   enum Status {
     PENDING = 'pending',
     APPROVED = 'approved',
     REJECTED = 'rejected',
   }
   if (status === Status.PENDING) { ... }
   ```

3. **Extract complex conditions**
   ```typescript
   // ❌ Bad
   if (user.role === 'admin' && user.isActive && !user.isLocked) { ... }
   
   // ✅ Good
   const canAccessAdminPanel = user.role === 'admin' && 
                                user.isActive && 
                                !user.isLocked;
   if (canAccessAdminPanel) { ... }
   ```

---

Happy coding! 🚀
