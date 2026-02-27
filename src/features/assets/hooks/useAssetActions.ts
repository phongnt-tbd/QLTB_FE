import { Asset, AllocateAssetDTO, TransferAssetDTO, MaintenanceDTO, RetireAssetDTO, DamageReportDTO } from '../types';
import { AssetItemStatus } from '@/types';
import { assetService } from '../services/assetService';

export const useAssetActions = (
  assets: Asset[],
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>
) => {
  /**
   * Cấp phát tài sản
   */
  const allocateAssets = (dto: AllocateAssetDTO, departmentName: string) => {
    const updatedAssets = assetService.updateItemsStatus(
      assets,
      dto.itemIds,
      AssetItemStatus.ALLOCATED,
      {
        currentDeptId: dto.departmentId,
        allocationDate: new Date().toISOString(),
      },
      {
        type: 'Allocation',
        description: `Bàn giao cho: ${departmentName}`,
        pdfUrl: dto.pdfUrl,
      }
    );

    setAssets(updatedAssets);
  };

  /**
   * Thu hồi tài sản
   */
  const recoverAssets = (itemIds: string[]) => {
    const updatedAssets = assetService.updateItemsStatus(
      assets,
      itemIds,
      AssetItemStatus.IN_STOCK,
      {
        currentDeptId: undefined,
        allocationDate: undefined,
      },
      {
        type: 'Recovery',
        description: 'Thu hồi về kho trung tâm',
      }
    );

    setAssets(updatedAssets);
  };

  /**
   * Điều chuyển tài sản
   */
  const transferAssets = (dto: TransferAssetDTO, departmentName: string) => {
    const updatedAssets = assetService.updateItemsStatus(
      assets,
      dto.itemIds,
      AssetItemStatus.ALLOCATED,
      {
        currentDeptId: dto.toDepartmentId,
        allocationDate: new Date().toISOString(),
      },
      {
        type: 'Transfer',
        description: `Điều chuyển hàng loạt sang: ${departmentName}`,
      }
    );

    setAssets(updatedAssets);
  };

  /**
   * Gửi sửa chữa
   */
  const sendToMaintenance = (dto: MaintenanceDTO) => {
    const updatedAssets = assets.map((batch) => {
      const itemsInBatch = batch.items.filter((item) => dto.itemIds.includes(item.id));
      if (itemsInBatch.length === 0) return batch;

      const updatedItems = batch.items.map((item) => {
        if (dto.itemIds.includes(item.id)) {
          const itemDetails = dto.details[item.id];
          return {
            ...item,
            status: AssetItemStatus.MAINTENANCE,
            provider: dto.provider,
            cost: itemDetails.cost,
          };
        }
        return item;
      });

      const newHistories = itemsInBatch.map((item) => ({
        id: `h-maint-${Date.now()}-${item.id}`,
        assetId: batch.id,
        type: 'Maintenance' as const,
        date: new Date().toISOString().split('T')[0],
        description: `Gửi sửa chữa [${item.assetCode}] tại ${dto.provider}. Nội dung: ${dto.details[item.id].reason}`,
        performedBy: 'Quản trị viên',
        provider: dto.provider,
        cost: dto.details[item.id].cost,
      }));

      return {
        ...batch,
        items: updatedItems,
        history: [...newHistories, ...batch.history],
      };
    });

    setAssets(updatedAssets);
  };

  /**
   * Thanh lý tài sản
   */
  const retireAssets = (dto: RetireAssetDTO) => {
    const updatedAssets = assetService.updateItemsStatus(
      assets,
      dto.itemIds,
      AssetItemStatus.RETIRED,
      {
        currentDeptId: undefined,
        allocationDate: undefined,
      },
      {
        type: 'Retire',
        description: `Thanh lý tài sản. Lý do: ${dto.reason}`,
        pdfUrl: dto.pdfUrl,
      }
    );

    setAssets(updatedAssets);
  };

  /**
   * Báo hỏng tài sản
   */
  const reportDamage = (dto: DamageReportDTO) => {
    const updatedAssets = assetService.updateItemsStatus(
      assets,
      dto.itemIds,
      AssetItemStatus.DAMAGED,
      {},
      {
        type: 'Maintenance',
        description: `Báo hỏng tài sản. Lý do: ${dto.reason}`,
      }
    );

    setAssets(updatedAssets);
  };

  return {
    allocateAssets,
    recoverAssets,
    transferAssets,
    sendToMaintenance,
    retireAssets,
    reportDamage,
  };
};
