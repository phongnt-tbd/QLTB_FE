import React from 'react';
import { AssetStats } from '../types';
import { AssetItemStatus } from '@/types';

interface AssetStatsCardsProps {
  stats: AssetStats;
}

export const AssetStatsCards: React.FC<AssetStatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      label: 'Tổng tài sản',
      value: stats.total,
      color: 'text-slate-900',
      bg: 'bg-white',
    },
    {
      label: 'Kho trung tâm',
      value: stats.inStock,
      color: 'text-green-600',
      bg: 'bg-white',
    },
    {
      label: 'Đang sử dụng',
      value: stats.allocated,
      color: 'text-blue-600',
      bg: 'bg-white',
    },
    {
      label: 'Đã hỏng',
      value: stats.damaged,
      color: 'text-orange-600',
      bg: 'bg-white',
    },
    {
      label: 'Đã thanh lý',
      value: stats.retired,
      color: 'text-red-600',
      bg: 'bg-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${card.bg} p-5 rounded-[2rem] border border-slate-200 shadow-sm`}
        >
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {card.label}
          </p>
          <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};
