import { ClipboardList, Package, ShoppingCart, Truck } from "lucide-react"
import { mockRequests, mockInventory, mockPurchaseOrders, mockVendors } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"

export default function ProcurementDashboard() {
  const approved = mockRequests.filter(r => r.status === "APPROVED")
  const stats = [
    { label: "Approved Requests", value: approved.length, icon: ClipboardList, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Inventory Items", value: mockInventory.length, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Purchase Orders", value: mockPurchaseOrders.length, icon: ShoppingCart, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Vendors", value: mockVendors.length, icon: Truck, color: "text-amber-500", bg: "bg-amber-500/10" },
  ]
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Procurement Dashboard</h1><p className="text-muted-foreground">Manage purchasing and vendor operations</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{stats.map(s => (<div key={s.label} className="bg-card border rounded-xl p-5 flex items-center gap-4"><div className={`w-12 h-12 ${s.bg} rounded-lg flex items-center justify-center`}><s.icon className={`w-6 h-6 ${s.color}`} /></div><div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold">{s.value}</p></div></div>))}</div>
      <div className="bg-card border rounded-xl"><div className="p-5 border-b"><h2 className="text-lg font-semibold">Approved Requests (Ready to Process)</h2></div><div className="p-4 space-y-3">{approved.map(r=>(<div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted"><div><p className="font-medium text-sm">{r.material}</p><p className="text-xs text-muted-foreground">Qty: {r.quantity} · {r.location}</p></div><StatusBadge status={r.status} /></div>))}</div></div>
    </div>
  )
}
