import { useEffect, useState } from "react"
import { notificationService } from "@/services/notificationService"
import { mockNotifications } from "@/lib/mockData"
import {
  Bell, CheckCheck, Trash2, ClipboardList,
  Package, AlertTriangle, Info, X, RefreshCw
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Notification = {
  id: string | number
  message: string
  read: boolean
  timestamp: string
}

const getIcon = (message: string) => {
  if (message.toLowerCase().includes("approved")) return { icon: ClipboardList, color: "text-teal-500", bg: "bg-teal-500/10" }
  if (message.toLowerCase().includes("rejected")) return { icon: X, color: "text-red-500", bg: "bg-red-500/10" }
  if (message.toLowerCase().includes("stock") || message.toLowerCase().includes("inventory")) return { icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" }
  if (message.toLowerCase().includes("alert")) return { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10" }
  return { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" }
}

export default function ProcurementNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await notificationService.getAll()
      setNotifications(data)
      setUsingMock(false)
    } catch {
      setNotifications(mockNotifications.map(n => ({ ...n, id: String(n.id) })))
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = async (id: string | number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    try {
      await notificationService.markAsRead(Number(id))
    } catch { }
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n => notificationService.markAsRead(Number(n.id)))
      )
    } catch { }
  }

  const clearAll = () => {
    setNotifications([])
    toast({ title: "Cleared", description: "All notifications cleared." })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {loading ? "Loading..." : unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-muted-foreground bg-slate-100 dark:bg-muted px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          {notifications.length > 0 && (
            <>
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 font-medium px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mock warning */}
      {usingMock && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          Backend unavailable — showing demo notifications.
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-2">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 dark:bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-muted rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <p className="font-medium text-slate-900 dark:text-foreground">All caught up!</p>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">
            No procurement notifications right now
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const { icon: Icon, color, bg } = getIcon(n.message)
            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                  n.read
                    ? "bg-white dark:bg-card border-[#E2E8F0] dark:border-border"
                    : "bg-teal-50 dark:bg-teal-500/5 border-teal-200 dark:border-teal-500/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${
                    n.read
                      ? "text-slate-600 dark:text-muted-foreground"
                      : "text-slate-900 dark:text-foreground font-medium"
                  }`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-muted-foreground mt-1">
                    {new Date(n.timestamp).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-2" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}