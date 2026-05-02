import { mockNotifications } from "@/lib/mockData"
import { Bell } from "lucide-react"

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Notifications</h1><p className="text-muted-foreground">System alerts</p></div>
      <div className="space-y-2">{mockNotifications.map(n => (<div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl border ${n.read ? "bg-card border-border" : "bg-teal-500/5 border-teal-500/20"}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : "bg-teal-500/20"}`}><Bell className={`w-5 h-5 ${n.read ? "text-muted-foreground" : "text-teal-600"}`} /></div><div className="flex-1"><p className={`text-sm ${n.read ? "text-muted-foreground" : "font-medium"}`}>{n.message}</p><p className="text-xs text-muted-foreground mt-1">{new Date(n.timestamp).toLocaleString()}</p></div></div>))}</div>
    </div>
  )
}
