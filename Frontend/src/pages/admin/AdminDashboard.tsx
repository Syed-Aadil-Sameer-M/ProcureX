import { ClipboardList, Users, Package, ShoppingCart, Clock, CheckCircle } from "lucide-react"
import { mockRequests, mockInventory, mockPurchaseOrders } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"

export default function AdminDashboard() {
  const pending = mockRequests.filter(r => r.status === "PENDING").length
  const stats = [
    { label: "Total Requests", value: mockRequests.length, icon: ClipboardList, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Pending Approval", value: pending, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Inventory Items", value: mockInventory.length, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Purchase Orders", value: mockPurchaseOrders.length, icon: ShoppingCart, color: "text-purple-500", bg: "bg-purple-500/10" },
  ]
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Admin Dashboard</h1><p className="text-slate-500 dark:text-muted-foreground">System-wide overview and management</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (<div key={s.label} className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5 flex items-center gap-4"><div className={`w-12 h-12 ${s.bg} rounded-lg flex items-center justify-center`}><s.icon className={`w-6 h-6 ${s.color}`} /></div><div><p className="text-sm text-slate-500 dark:text-muted-foreground">{s.label}</p><p className="text-2xl font-bold text-slate-900 dark:text-foreground">{s.value}</p></div></div>))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /><h2 className="text-lg font-semibold">Pending Requests</h2></div>
          <div className="p-4 space-y-3">{mockRequests.filter(r=>r.status==="PENDING").map(r=>(<div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"><div><p className="font-medium text-sm">{r.material}</p><p className="text-xs text-slate-500">by {r.requestedBy} · Qty: {r.quantity}</p></div><StatusBadge status={r.status} /></div>))}</div>
        </div>
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /><h2 className="text-lg font-semibold">Recent Activity</h2></div>
          <div className="p-4 space-y-3">{mockRequests.filter(r=>r.status!=="PENDING").slice(0,4).map(r=>(<div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"><div><p className="font-medium text-sm">{r.material}</p><p className="text-xs text-slate-500">{r.date}</p></div><StatusBadge status={r.status} /></div>))}</div>
        </div>
      </div>
    </div>
  )
}
