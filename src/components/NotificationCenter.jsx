import React, { useEffect } from 'react';
import { X, Bell, AlertTriangle, Clock, Timer } from 'lucide-react';

export const NotificationCenter = ({ notifications, onRemoveNotification }) => {
  useEffect(() => {
    // Auto-remove notifications after 8 seconds (except pending reminders)
    notifications.forEach(notification => {
      if (!notification.persistent && notification.type !== 'pending') {
        setTimeout(() => {
          onRemoveNotification(notification.id);
        }, 8000);
      } else if (notification.type === 'pending') {
        // Pending reminders stay for 15 seconds
        setTimeout(() => {
          onRemoveNotification(notification.id);
        }, 15000);
      }
    });
  }, [notifications, onRemoveNotification]);

  if (notifications.length === 0) return null;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle size={20} />;
      case 'warning':
        return <Clock size={20} />;
      case 'overdue':
        return <AlertTriangle size={20} />;
      case 'pending':
        return <Timer size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  return (
    <div className="notification-center">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="notification-content">
            <div className="notification-title">{notification.title}</div>
            <div className="notification-message">{notification.message}</div>
          </div>
          <button
            onClick={() => onRemoveNotification(notification.id)}
            className="notification-close"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};