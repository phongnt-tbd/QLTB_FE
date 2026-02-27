import React from 'react';
import type { Notification } from '../types';

interface NotificationsPanelProps {
  notifications: Notification[];
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
      <h3 className="font-black text-slate-800 mb-8 flex items-center text-lg uppercase tracking-widest">
        <i className="fas fa-bell mr-3 text-red-600"></i> Thông báo
      </h3>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-5 ${notification.bgColor} border ${notification.borderColor} rounded-[2rem]`}
          >
            <p className={`text-sm ${notification.textColor} font-black`}>{notification.title}</p>
            <p className={`text-xs mt-2 font-medium leading-relaxed`} style={{ color: notification.textColor }}>
              {notification.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
