import { Bell, X, CheckCheck, Trash2, Package, ClipboardList, AlertTriangle, Info } from "lucide-react"
import type { Notification } from "@/hooks/useNotifications"

interface Props {
  open: boolean
  onClose: () => void
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onClearAll: () => void
}

const getIcon = (message: string) => {
  if (message.toLowerCase().includes("approved")) return { icon: ClipboardList, color: "text-teal-500", bg: "bg-teal-500/10" }
  if (message.toLowerCase().includes("rejected")) return { icon: X, color: "text-red-500", bg: "bg-red-500/10" }
  if (message.toLowerCase().includes("stock") || message.toLowerCase().includes("inventory")) return { icon: Package, color: "text-amber-500", bg: "bg-amber-500/10" }
  if (message.toLowerCase().includes("alert") || message.toLowerCase().includes("warning")) return { icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-500/10" }
  return { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" }
}

const timeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (mins > 0) return `${mins}m ago`
  return "Just now"
}

export default function NotificationsDrawer({
  open, onClose, notifications, unreadCount,
  onMarkAsRead, onMarkAllAsRead, onClearAll
}: Props) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 z-50 bg-white dark:bg-card border-l border-[#E2E8F0] dark:border-border shadow-2xl transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] dark:border-border">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-500" />
            <h2 className="font-semibold text-slate-900 dark:text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-teal-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#E2E8F0] dark:border-border">
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
        )}

        {/* Notification list */}
        <div className="overflow-y-auto h-[calc(100%-110px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-14 h-14 bg-slate-100 dark:bg-muted rounded-full flex items-center justify-center mb-3">
                <Bell className="w-7 h-7 text-slate-400" />
              </div>
              <p className="font-medium text-slate-900 dark:text-foreground">All caught up!</p>
              <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">
                No notifications right now
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0] dark:divide-border">
              {notifications.map(n => {
                const { icon: Icon, color, bg } = getIcon(n.message)
                return (
                  <div
                    key={n.id}
                    onClick={() => onMarkAsRead(n.id)}
                    className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-[#F8FAFC] dark:hover:bg-muted ${!n.read ? "bg-teal-50/50 dark:bg-teal-500/5" : ""}`}
                  >
                    <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${n.read ? "text-slate-600 dark:text-muted-foreground" : "text-slate-900 dark:text-foreground font-medium"}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-muted-foreground mt-1">
                        {timeAgo(n.timestamp)}
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
      </div>
    </>
  )
}