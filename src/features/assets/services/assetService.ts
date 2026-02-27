import { Asset, AssetItem, CreateAssetDTO, LifecycleEvent, AssetWithParent } from '../types';
import { AssetItemStatus } from '@/types';

export const assetService = {
  /**
   * Tạo mã batch tự động
   */
  generateBatchCode: (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 900) + 100;
    return `UNI-${year}-${month}-${random}`;
  },

  /**
   * Tạo danh sách items cho một batch
   */
  generateItems: (batchId: string, batchCode: string, quantity: number): AssetItem[] => {
    return Array.from({ length: quantity }).map((_, index) => ({
      id: `item-${batchId}-${index}`,
      assetCode: `${batchCode}-${(index + 1).toString().padStart(3, '0')}`,
      batchId,
      status: AssetItemStatus.IN_STOCK,
    }));
  },

  /**
   * Tạo asset batch mới
   */
  createAsset: (dto: CreateAssetDTO): Asset => {
    const batchId = Math.random().toString(36).substring(2, 11);
    const batchCode = assetService.generateBatchCode();
    const items = assetService.generateItems(batchId, batchCode, dto.quantity);

    const newAsset: Asset = {
      id: batchId,
      batchCode,
      name: dto.name,
      category: dto.category,
      specifications: dto.specifications || 'N/A',
      totalQuantity: dto.quantity,
      supplierId: dto.supplierId,
      purchaseDate: dto.purchaseDate,
      unitPrice: dto.unitPrice,
      warrantyMonths: dto.warrantyMonths,
      importPdfUrl: dto.importPdfUrl,
      items,
      history: [
        {
          id: `h-${batchId}`,
          assetId: batchId,
          type: 'Import',
          date: new Date().toISOString().split('T')[0],
          description: `Nhập kho lô hàng mới: ${dto.quantity} x ${dto.name}. Đã đính kèm chứng từ PDF.`,
          performedBy: 'Quản trị viên',
          pdfUrl: dto.importPdfUrl,
        },
      ],
    };

    return newAsset;
  },

  /**
   * Làm phẳng assets thành danh sách items với parent batch
   */
  flattenAssets: (assets: Asset[]): AssetWithParent[] => {
    return assets.flatMap((batch) =>
      batch.items.map((item) => ({
        ...item,
        parentBatch: batch,
      }))
    );
  },

  /**
   * Cập nhật trạng thái items và thêm history
   */
  updateItemsStatus: (
    assets: Asset[],
    itemIds: string[],
    newStatus: AssetItemStatus,
    extraData: Partial<AssetItem>,
    historyEvent: Omit<LifecycleEvent, 'id' | 'assetId'>
  ): Asset[] => {
    return assets.map((batch) => {
      const itemsInBatch = batch.items.filter((item) => itemIds.includes(item.id));
      if (itemsInBatch.length === 0) return batch;

      const updatedItems = batch.items.map((item) => {
        if (itemIds.includes(item.id)) {
          return { ...item, status: newStatus, ...extraData };
        }
        return item;
      });

      const newHistory: LifecycleEvent = {
        id: `h-${Date.now()}-${batch.id}`,
        assetId: batch.id,
        date: new Date().toISOString().split('T')[0],
        performedBy: 'Quản trị viên',
        ...historyEvent,
        description: `${historyEvent.description} cho tài sản: ${itemsInBatch.map((i) => i.assetCode).join(', ')}`,
      };

      return {
        ...batch,
        items: updatedItems,
        history: [newHistory, ...batch.history],
      };
    });
  },

  /**
   * Validate asset import data
   */
  validateCreateAsset: (dto: Partial<CreateAssetDTO>): string[] => {
    const errors: string[] = [];

    if (!dto.name?.trim()) {
      errors.push('Tên tài sản không được để trống');
    }

    if (!dto.category) {
      errors.push('Vui lòng chọn danh mục');
    }

    if (!dto.quantity || dto.quantity < 1) {
      errors.push('Số lượng phải lớn hơn 0');
    }

    if (!dto.supplierId) {
      errors.push('Vui lòng chọn nhà cung cấp');
    }

    if (!dto.purchaseDate) {
      errors.push('Vui lòng chọn ngày mua');
    }

    if (!dto.unitPrice || dto.unitPrice < 0) {
      errors.push('Đơn giá không hợp lệ');
    }

    if (dto.warrantyMonths === undefined || dto.warrantyMonths < 0) {
      errors.push('Thời gian bảo hành không hợp lệ');
    }

    return errors;
  },

  /**
   * Filter assets
   */
  filterAssets: (
    items: AssetWithParent[],
    search: string,
    statusFilter: string,
    categoryFilter: string
  ): AssetWithParent[] => {
    return items.filter((item) => {
      const matchesSearch =
        item.assetCode.toLowerCase().includes(search.toLowerCase()) ||
        item.parentBatch.name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || item.parentBatch.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  },

  /**
   * Get asset statistics
   */
  getAssetStats: (items: AssetWithParent[]) => {
    return {
      total: items.length,
      inStock: items.filter((i) => i.status === AssetItemStatus.IN_STOCK).length,
      allocated: items.filter((i) => i.status === AssetItemStatus.ALLOCATED).length,
      damaged: items.filter((i) => i.status === AssetItemStatus.DAMAGED).length,
      retired: items.filter((i) => i.status === AssetItemStatus.RETIRED).length,
    };
  },
};
