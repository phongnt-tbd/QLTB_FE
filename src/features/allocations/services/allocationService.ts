import { Asset, AssetItem, AssetItemStatus, Department, LifecycleEvent, User } from '@/types';
import { ItemWithBatch, DepartmentWithCount } from '../types';

export const allocationService = {
  /**
   * Get all items with parent batch info
   */
  getAllItems: (assets: Asset[]): ItemWithBatch[] => {
    return assets.flatMap(batch =>
      batch.items.map(item => ({
        ...item,
        parentBatch: batch,
      }))
    );
  },

  /**
   * Get department statistics
   */
  getDepartmentStats: (
    departments: Department[],
    allItems: ItemWithBatch[],
    searchTerm: string
  ): DepartmentWithCount[] => {
    return departments
      .filter(d => d.id !== 'stock')
      .map(dept => {
        const count = allItems.filter(item => item.currentDeptId === dept.id).length;
        return { ...dept, assetCount: count };
      })
      .filter(
        dept =>
          dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
  },

  /**
   * Get assets for specific department
   */
  getDepartmentAssets: (allItems: ItemWithBatch[], deptId: string | null): ItemWithBatch[] => {
    if (!deptId) return [];
    return allItems.filter(item => item.currentDeptId === deptId);
  },

  /**
   * Get stock assets available for allocation
   */
  getStockAssets: (allItems: ItemWithBatch[]): ItemWithBatch[] => {
    return allItems.filter(
      item => item.status === AssetItemStatus.IN_STOCK && !item.currentDeptId
    );
  },

  /**
   * Filter department assets by search term
   */
  filterDepartmentAssets: (items: ItemWithBatch[], searchTerm: string): ItemWithBatch[] => {
    return items.filter(
      item =>
        item.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.parentBatch.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  /**
   * Allocate assets to department
   */
  allocateAssets: (
    assets: Asset[],
    selectedAssetIds: string[],
    deptId: string,
    deptName: string,
    user: User,
    pdfUrl?: string
  ): Asset[] => {
    return assets.map(batch => {
      const itemsInThisBatchToUpdate = batch.items.filter(i =>
        selectedAssetIds.includes(i.id)
      );
      if (itemsInThisBatchToUpdate.length === 0) return batch;

      const updatedItems = batch.items.map(i => {
        if (selectedAssetIds.includes(i.id)) {
          return {
            ...i,
            status: AssetItemStatus.ALLOCATED,
            currentDeptId: deptId,
            allocationDate: new Date().toISOString(),
          };
        }
        return i;
      });

      const newHistory: LifecycleEvent = {
        id: `h-alloc-${Date.now()}-${batch.id}`,
        assetId: batch.id,
        type: 'Allocation',
        date: new Date().toISOString().split('T')[0],
        description: `Cấp phát tài sản cho đơn vị ${deptName} cho mã: ${itemsInThisBatchToUpdate
          .map(i => i.assetCode)
          .join(', ')}`,
        performedBy: user.fullName,
        pdfUrl: pdfUrl,
      };

      return { ...batch, items: updatedItems, history: [newHistory, ...batch.history] };
    });
  },

  /**
   * Recover assets back to stock
   */
  recoverAssets: (assets: Asset[], selectedAssetIds: string[], user: User): Asset[] => {
    return assets.map(batch => {
      const itemsInThisBatchToUpdate = batch.items.filter(i =>
        selectedAssetIds.includes(i.id)
      );
      if (itemsInThisBatchToUpdate.length === 0) return batch;

      const updatedItems = batch.items.map(i => {
        if (selectedAssetIds.includes(i.id)) {
          return {
            ...i,
            status: AssetItemStatus.IN_STOCK,
            currentDeptId: undefined,
            allocationDate: undefined,
          };
        }
        return i;
      });

      const newHistory: LifecycleEvent = {
        id: `h-alloc-${Date.now()}-${batch.id}`,
        assetId: batch.id,
        type: 'Recovery',
        date: new Date().toISOString().split('T')[0],
        description: `Thu hồi tài sản về kho trung tâm cho mã: ${itemsInThisBatchToUpdate
          .map(i => i.assetCode)
          .join(', ')}`,
        performedBy: user.fullName,
      };

      return { ...batch, items: updatedItems, history: [newHistory, ...batch.history] };
    });
  },
};
