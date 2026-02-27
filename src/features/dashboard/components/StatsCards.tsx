import React from 'react';
import type { DashboardStatCard } from '../types';

interface StatsCardsProps {
  cards: DashboardStatCard[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <i className={`fas ${stat.icon} text-xl`}></i>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Thống kê</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
          <p className="text-slate-500 text-sm mt-1 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};
