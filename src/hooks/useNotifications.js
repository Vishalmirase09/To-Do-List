import { useState, useCallback } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...notification,
    };

    // Check if similar notification already exists
    setNotifications(prev => {
      const exists = prev.some(n => 
        n.taskId === notification.taskId && 
        n.type === notification.type
      );
      
      if (exists) return prev;
      
      return [newNotification, ...prev];
    });
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};