import { Bell, CheckCheck, Trash2, ClipboardList, Package, AlertTriangle, Info, X } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"

const getIcon = (message: string) => {
  if (message.toLowerCase().includes("approved")) return { icon: ClipboardList, color: "text-teal-500", bg: "bg-teal-500/10" }
  if (message.toLowerCase().includes("rejected")) return { icon: X, color: "text-red-500", bg: "bg-red-500/10" }
  if (message.toLowerCase().includes("stock") || message.toLowerCase().includes("inventory")) return { icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" }
  if (message.toLowerCase().includes("alert")) return { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10" }
  return { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" }
}

export default function AdminNotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications()

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Notifications</h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {notifications.length > 0 && (
          <div className="flex gap-2">
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
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-muted rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <p className="font-medium text-slate-900 dark:text-foreground">All caught up!</p>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">No notifications right now</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const { icon: Icon, color, bg } = getIcon(n.message)
            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors hover:shadow-sm ${n.read
                  ? "bg-white dark:bg-card border-[#E2E8F0] dark:border-border"
                  : "bg-teal-50 dark:bg-teal-500/5 border-teal-200 dark:border-teal-500/20"
                }`}
              >
                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? "text-slate-600 dark:text-muted-foreground" : "text-slate-900 dark:text-foreground font-medium"}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
                </div>
                {!n.read && <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-2" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}