import React from 'react';
import { Asset } from '@/types';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { StatsCards } from '../components/StatsCards';
import { RecentActivities } from '../components/RecentActivities';
import { NotificationsPanel } from '../components/NotificationsPanel';

interface DashboardPageProps {
  assets: Asset[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ assets }) => {
  const { statCards, recentActivities, notifications } = useDashboardStats(assets);

  return (
    <div className="space-y-8">
      <StatsCards cards={statCards} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivities activities={recentActivities} />
        <NotificationsPanel notifications={notifications} />
      </div>
    </div>
  );
};
