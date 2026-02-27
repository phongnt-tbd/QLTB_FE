import React from 'react';
import type { RecentActivity } from '../types';

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
      <h3 className="font-black text-slate-800 mb-8 flex items-center text-lg uppercase tracking-widest">
        <i className="fas fa-history mr-3 text-blue-600"></i> Hoạt động gần đây
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
              <i className="fas fa-sync-alt"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-900 font-black">
                Cập nhật lô tài sản: {activity.assetName}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                Mã lô {activity.batchCode} • {activity.date}
              </p>
            </div>
            <span className="text-[10px] font-black px-3 py-1 bg-green-50 text-green-700 rounded-lg uppercase tracking-widest">
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
