import { mockNotifications } from "@/lib/mockData"
import { Bell } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Notifications</h1><p className="text-slate-500 dark:text-muted-foreground">Stay updated on your requests</p></div>
      <div className="space-y-2">
        {mockNotifications.map(n => (
          <div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${n.read ? "bg-white dark:bg-card border-[#E2E8F0] dark:border-border" : "bg-teal-50 dark:bg-teal-500/5 border-teal-200 dark:border-teal-500/20"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.read ? "bg-slate-100 dark:bg-muted" : "bg-teal-100 dark:bg-teal-500/20"}`}><Bell className={`w-5 h-5 ${n.read ? "text-slate-400" : "text-teal-600"}`} /></div>
            <div className="flex-1 min-w-0"><p className={`text-sm ${n.read ? "text-slate-600 dark:text-muted-foreground" : "text-slate-900 dark:text-foreground font-medium"}`}>{n.message}</p><p className="text-xs text-slate-400 mt-1">{new Date(n.timestamp).toLocaleString()}</p></div>
            {!n.read && <span className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-2" />}
          </div>
        ))}
      </div>
    </div>
  )
}
