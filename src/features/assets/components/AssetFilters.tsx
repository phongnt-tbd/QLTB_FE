import React from 'react';
import { AssetCategory } from '@/types';
import { AssetItemStatus } from '@/types';

interface AssetFiltersProps {
  search: string;
  statusFilter: string;
  categoryFilter: string;
  categories: AssetCategory[];
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  search,
  statusFilter,
  categoryFilter,
  categories,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
      <div className="relative flex-1">
        <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input
          type="text"
          placeholder="Tìm theo mã tài sản, tên..."
          className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm min-w-[160px]"
        value={categoryFilter}
        onChange={(e) => onCategoryFilterChange(e.target.value)}
      >
        <option value="All">Tất cả danh mục</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm min-w-[160px]"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
      >
        <option value="All">Tất cả trạng thái</option>
        {Object.values(AssetItemStatus).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};
