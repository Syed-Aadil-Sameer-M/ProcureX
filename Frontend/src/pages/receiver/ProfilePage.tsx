import { useAuth } from "@/contexts/AuthContext"
import { User, Mail, Shield, Building } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const fields = [
    { icon: User, label: "Name", value: user?.name || "—" },
    { icon: Mail, label: "Email", value: user?.email || "—" },
    { icon: Shield, label: "Role", value: user?.role?.toUpperCase() || "—" },
    { icon: Building, label: "Department", value: user?.department || "—" },
  ]
  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Profile</h1><p className="text-slate-500 dark:text-muted-foreground">Your account details</p></div>
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 text-2xl font-bold">{user?.name?.charAt(0) || "U"}</div>
          <div><p className="text-xl font-semibold text-slate-900 dark:text-foreground">{user?.name}</p><p className="text-sm text-slate-500 dark:text-muted-foreground capitalize">{user?.role} Account</p></div>
        </div>
        <div className="space-y-4">
          {fields.map(f => (<div key={f.label} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"><f.icon className="w-5 h-5 text-slate-400 shrink-0" /><div><p className="text-xs text-slate-500 dark:text-muted-foreground">{f.label}</p><p className="text-sm font-medium text-slate-900 dark:text-foreground">{f.value}</p></div></div>))}
        </div>
      </div>
    </div>
  )
}
