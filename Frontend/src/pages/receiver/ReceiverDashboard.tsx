import { ClipboardList, CheckCircle, Clock, XCircle } from "lucide-react"
import { mockRequests } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"

export default function ReceiverDashboard() {
  const pending = mockRequests.filter(r => r.status === "PENDING").length
  const approved = mockRequests.filter(r => r.status === "APPROVED").length
  const rejected = mockRequests.filter(r => r.status === "REJECTED").length
  const recent = mockRequests.slice(0, 5)

  const stats = [
    { label: "Total Requests", value: mockRequests.length, icon: ClipboardList, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Pending", value: pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Approved", value: approved, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  ]

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Receiver Dashboard</h1><p className="text-slate-500 dark:text-muted-foreground">Overview of your material requests</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (<div key={s.label} className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5 flex items-center gap-4">
          <div className={`w-12 h-12 ${s.bg} rounded-lg flex items-center justify-center`}><s.icon className={`w-6 h-6 ${s.color}`} /></div>
          <div><p className="text-sm text-slate-500 dark:text-muted-foreground">{s.label}</p><p className="text-2xl font-bold text-slate-900 dark:text-foreground">{s.value}</p></div>
        </div>))}
      </div>
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
        <div className="p-5 border-b border-[#E2E8F0] dark:border-border"><h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">Recent Requests</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase bg-[#F8FAFC] dark:bg-muted"><tr><th className="px-6 py-3 text-left">ID</th><th className="px-6 py-3 text-left">Material</th><th className="px-6 py-3 text-left">Qty</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-left">Date</th></tr></thead>
            <tbody>{recent.map(r => (<tr key={r.id} className="border-b border-[#E2E8F0] dark:border-border hover:bg-teal-50 dark:hover:bg-muted transition-colors"><td className="px-6 py-4 font-medium text-slate-900 dark:text-foreground">{r.id}</td><td className="px-6 py-4 text-slate-600 dark:text-foreground">{r.material}</td><td className="px-6 py-4 text-slate-600 dark:text-foreground">{r.quantity}</td><td className="px-6 py-4"><StatusBadge status={r.status} /></td><td className="px-6 py-4 text-slate-500 dark:text-muted-foreground">{r.date}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
