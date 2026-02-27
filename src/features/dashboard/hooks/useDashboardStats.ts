import { useMemo } from 'react';
import { Asset } from '@/types';
import { dashboardService } from '../services/dashboardService';

export const useDashboardStats = (assets: Asset[]) => {
  const stats = useMemo(() => {
    return dashboardService.calculateStats(assets);
  }, [assets]);

  const statCards = useMemo(() => {
    return dashboardService.getStatCards(stats);
  }, [stats]);

  const recentActivities = useMemo(() => {
    return dashboardService.getRecentActivities(assets, 5);
  }, [assets]);

  const notifications = useMemo(() => {
    return dashboardService.getNotifications(stats);
  }, [stats]);

  return {
    stats,
    statCards,
    recentActivities,
    notifications,
  };
};
