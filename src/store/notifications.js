import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore({
  id: 'notifications',
  state: () => ({
    notifications: [],
    unreadCount: 0,
  }),
  actions: {
    addNotification(notification) {
      this.notifications.unshift(notification);
      this.unreadCount++;
      // Keep only the last 50 notifications
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(0, 50);
      }
    },
    markAsRead() {
      this.unreadCount = 0;
      // Mark all notifications as read
      this.notifications.forEach(notif => {
        notif.read = true;
      });
    },
    clearNotifications() {
      this.notifications = [];
      this.unreadCount = 0;
    },
  },
});
