import { useEffect, useState } from "react"
import { notificationService } from "@/services/notificationService"
import { Bell, Loader2 } from "lucide-react"

export default function ProcurementNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationService.getAll()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Notifications</h1>
        <p className="text-slate-500 dark:text-muted-foreground">Procurement alerts</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                n.isRead
                  ? "bg-white dark:bg-card border-[#E2E8F0] dark:border-border"
                  : "bg-teal-50 dark:bg-teal-500/5 border-teal-200 dark:border-teal-500/20"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                n.isRead ? "bg-slate-100 dark:bg-muted" : "bg-teal-100 dark:bg-teal-500/20"
              }`}>
                <Bell className={`w-5 h-5 ${n.isRead ? "text-slate-400" : "text-teal-600"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.isRead ? "text-slate-600 dark:text-muted-foreground" : "text-slate-900 dark:text-foreground font-medium"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(n.timestamp).toLocaleString()}
                </p>
              </div>
              {!n.isRead && <span className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-2" />}
            </div>
          ))}
          {notifications.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">No notifications found.</p>
          )}
        </div>
      )}
    </div>
  )
}
