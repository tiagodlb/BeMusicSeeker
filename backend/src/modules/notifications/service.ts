import { NotificationRepository } from "./repository";

export class NotificationService {
  async getNotifications(userId: number, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const [notifications, unreadCount] = await Promise.all([
      NotificationRepository.getUserNotifications(userId, limit, offset),
      NotificationRepository.getUnreadCount(userId)
    ]);

    return {
      notifications,
      unreadCount,
      hasMore: notifications.length === limit
    };
  }

  async getUnreadCount(userId: number) {
    return NotificationRepository.getUnreadCount(userId);
  }

  async markAsRead(notificationId: number, userId: number) {
    return NotificationRepository.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: number) {
    return NotificationRepository.markAllAsRead(userId);
  }
}