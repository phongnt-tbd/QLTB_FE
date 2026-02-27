import { Asset, AssetItemStatus } from '@/types';
import { DashboardStats, DashboardStatCard, RecentActivity, Notification } from '../types';

export const dashboardService = {
  /**
   * Calculate dashboard statistics from assets
   */
  calculateStats: (assets: Asset[]): DashboardStats => {
    const totalItems = assets.reduce((sum, a) => sum + a.totalQuantity, 0);
    const inStock = assets.reduce(
      (sum, a) => sum + a.items.filter((i) => i.status === AssetItemStatus.IN_STOCK).length,
      0
    );
    const maintenanceCount = assets.reduce(
      (sum, a) => sum + a.items.filter((i) => i.status === AssetItemStatus.MAINTENANCE).length,
      0
    );
    const damagedCount = assets.reduce(
      (sum, a) => sum + a.items.filter((i) => i.status === AssetItemStatus.DAMAGED).length,
      0
    );
    const allocated = assets.reduce(
      (sum, a) => sum + a.items.filter((i) => i.status === AssetItemStatus.ALLOCATED).length,
      0
    );

    return {
      total: totalItems,
      allocated,
      maintenance: maintenanceCount,
      damaged: damagedCount,
      inStock,
    };
  },

  /**
   * Transform stats to card format
   */
  getStatCards: (stats: DashboardStats): DashboardStatCard[] => {
    return [
      {
        label: 'Tổng số tài sản',
        value: stats.total.toLocaleString(),
        icon: 'fa-desktop',
        color: 'bg-blue-500',
      },
      {
        label: 'Đang phân bổ',
        value: stats.allocated.toLocaleString(),
        icon: 'fa-check-circle',
        color: 'bg-green-500',
      },
      {
        label: 'Hỏng & Bảo trì',
        value: (stats.maintenance + stats.damaged).toLocaleString(),
        icon: 'fa-tools',
        color: 'bg-amber-500',
      },
      {
        label: 'Tồn kho trung tâm',
        value: stats.inStock.toLocaleString(),
        icon: 'fa-warehouse',
        color: 'bg-indigo-500',
      },
    ];
  },

  /**
   * Get recent activities from assets
   */
  getRecentActivities: (assets: Asset[], limit: number = 5): RecentActivity[] => {
    return assets.slice(0, limit).map((asset) => ({
      id: asset.id,
      assetName: asset.name,
      batchCode: asset.batchCode,
      date: asset.purchaseDate,
      status: 'Đã nhập kho',
    }));
  },

  /**
   * Generate notifications based on stats
   */
  getNotifications: (stats: DashboardStats): Notification[] => {
    const notifications: Notification[] = [];

    // Warning for damaged and maintenance assets
    if (stats.damaged > 0 || stats.maintenance > 0) {
      notifications.push({
        id: 'notif-1',
        type: 'warning',
        title: 'Tài sản lỗi & bảo trì',
        message: `Có ${stats.damaged} tài sản báo hỏng và ${stats.maintenance} tài sản đang bảo trì. Vui lòng kiểm tra trang Hỏng & Thanh lý.`,
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-100',
        textColor: 'text-amber-900',
      });
    }

    // System reminder (always show)
    notifications.push({
      id: 'notif-2',
      type: 'info',
      title: 'Nhắc nhở hệ thống',
      message: 'Đã đến kỳ kiểm kê tài sản định kỳ quý 4. Vui lòng chuẩn bị báo cáo trước ngày 30/11.',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-100',
      textColor: 'text-slate-800',
    });

    return notifications;
  },
};
