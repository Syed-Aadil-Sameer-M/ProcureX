import { useState } from "react"
import { mockNotifications } from "@/lib/mockData"

export type Notification = {
  id: string
  message: string
  read: boolean
  timestamp: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications.map(n => ({ ...n, read: n.read }))
  )

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead, clearAll }
}