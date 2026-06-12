import { useState, useEffect } from "react"
import { notificationService } from "@/services/notificationService"

export type Notification = {
  id: string
  message: string
  read: boolean
  timestamp: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    notificationService.getAll().then(data => {
      setNotifications(data);
    }).catch(err => {
      console.error("Failed to load notifications", err);
    });
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(Number(id));
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  }

  const markAllAsRead = async () => {
    // Optional: implement if there's a markAllAsRead backend endpoint
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead, clearAll }
}