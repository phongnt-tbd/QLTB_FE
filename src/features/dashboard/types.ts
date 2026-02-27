// Types for Dashboard feature
import type { Asset, AssetItemStatus } from '@/types';

export interface DashboardStats {
  total: number;
  allocated: number;
  maintenance: number;
  damaged: number;
  inStock: number;
}

export interface DashboardStatCard {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface RecentActivity {
  id: string;
  assetName: string;
  batchCode: string;
  date: string;
  status: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}
