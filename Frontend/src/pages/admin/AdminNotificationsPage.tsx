import { useEffect, useState } from "react"
import { notificationService } from "@/services/notificationService"
import { Bell, Loader2 } from "lucide-react"

export default function AdminNotificationsPage() {
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
        <p className="text-slate-500 dark:text-muted-foreground">System alerts from backend</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl border ${n.isRead ? "bg-card border-border" : "bg-teal-500/5 border-teal-500/20"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.isRead ? "bg-muted" : "bg-teal-500/20"}`}>
                <Bell className={`w-5 h-5 ${n.isRead ? "text-muted-foreground" : "text-teal-600"}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${n.isRead ? "text-muted-foreground" : "font-medium"}`}>{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {notifications.length === 0 && <p className="text-center py-8 text-muted-foreground">No notifications found.</p>}
        </div>
      )}
    </div>
  )
}
