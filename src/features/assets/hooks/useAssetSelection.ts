import { useState, useMemo } from 'react';
import { AssetWithParent } from '../types';
import { AssetItemStatus } from '@/types';

export const useAssetSelection = (filteredItems: AssetWithParent[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedItems = useMemo(() => {
    return filteredItems.filter((item) => selectedIds.includes(item.id));
  }, [filteredItems, selectedIds]);

  // Check what bulk actions are available
  const canBulkAllocate = useMemo(() => {
    return selectedItems.length > 0 && selectedItems.every((i) => i.status === AssetItemStatus.IN_STOCK);
  }, [selectedItems]);

  const canBulkRecover = useMemo(() => {
    return selectedItems.length > 0 && selectedItems.every((i) => i.status === AssetItemStatus.ALLOCATED);
  }, [selectedItems]);

  const canBulkMaintain = useMemo(() => {
    return (
      selectedItems.length > 0 &&
      selectedItems.every((i) => i.status !== AssetItemStatus.MAINTENANCE && i.status !== AssetItemStatus.RETIRED)
    );
  }, [selectedItems]);

  const canBulkRetire = useMemo(() => {
    return (
      selectedItems.length > 0 &&
      selectedItems.every((i) => i.status !== AssetItemStatus.RETIRED && i.status !== AssetItemStatus.MAINTENANCE)
    );
  }, [selectedItems]);

  const canBulkReportDamage = useMemo(() => {
    return (
      selectedItems.length > 0 &&
      selectedItems.every((i) => i.status === AssetItemStatus.ALLOCATED || i.status === AssetItemStatus.IN_STOCK)
    );
  }, [selectedItems]);

  const canBulkTransfer = useMemo(() => {
    if (selectedItems.length <= 1) return false;
    const allAllocated = selectedItems.every((i) => i.status === AssetItemStatus.ALLOCATED);
    if (!allAllocated) return false;
    const firstDeptId = selectedItems[0].currentDeptId;
    return firstDeptId !== undefined && selectedItems.every((i) => i.currentDeptId === firstDeptId);
  }, [selectedItems]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = () => {
    setSelectedIds(filteredItems.map((i) => i.id));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const selectSingle = (id: string) => {
    setSelectedIds([id]);
  };

  return {
    selectedIds,
    selectedItems,
    canBulkAllocate,
    canBulkRecover,
    canBulkMaintain,
    canBulkRetire,
    canBulkReportDamage,
    canBulkTransfer,
    toggleSelect,
    selectAll,
    deselectAll,
    selectSingle,
  };
};
