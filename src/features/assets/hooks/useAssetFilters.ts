import { useState, useMemo } from 'react';
import { Asset, AssetWithParent, AssetFilters } from '../types';
import { assetService } from '../services/assetService';

export const useAssetFilters = (assets: Asset[]) => {
  const [filters, setFilters] = useState<AssetFilters>({
    search: '',
    statusFilter: 'All',
    categoryFilter: 'All',
  });

  // Flatten assets to items with parent batch
  const allItems = useMemo(() => {
    return assetService.flattenAssets(assets);
  }, [assets]);

  // Apply filters
  const filteredItems = useMemo(() => {
    return assetService.filterAssets(
      allItems,
      filters.search,
      filters.statusFilter,
      filters.categoryFilter
    );
  }, [allItems, filters]);

  // Calculate statistics
  const stats = useMemo(() => {
    return assetService.getAssetStats(allItems);
  }, [allItems]);

  const updateSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const updateStatusFilter = (statusFilter: string) => {
    setFilters((prev) => ({ ...prev, statusFilter }));
  };

  const updateCategoryFilter = (categoryFilter: string) => {
    setFilters((prev) => ({ ...prev, categoryFilter }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      statusFilter: 'All',
      categoryFilter: 'All',
    });
  };

  return {
    filters,
    allItems,
    filteredItems,
    stats,
    updateSearch,
    updateStatusFilter,
    updateCategoryFilter,
    resetFilters,
  };
};
