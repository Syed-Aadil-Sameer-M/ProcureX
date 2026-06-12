import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts"
import {
  ClipboardList, Package, ShoppingCart,
  Truck, TrendingUp, Plus, RefreshCw
} from "lucide-react"
import { requestService } from "@/services/requestService"
import { inventoryService } from "@/services/inventoryService"
import { poService } from "@/services/poService"
import { mockRequests, mockInventory, mockPurchaseOrders, mockVendors } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { useNavigate } from "react-router-dom"

const PO_COLORS: Record<string, string> = {
  CREATED: "#378ADD",
  SENT: "#E3B341",
  RECEIVED: "#1D9E75",
  COMPLETED: "#8B949E",
}

function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} style={style} />
  )
}

export default function ProcurementDashboard() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [req, inv, po] = await Promise.all([
        requestService.getAll(),
        inventoryService.getAll(),
        poService.getAll(),
      ])
      setRequests(req)
      setInventory(inv)
      setPurchaseOrders(po)
      setUsingMock(false)
      setLastUpdated(new Date())
    } catch {
      setRequests(mockRequests)
      setInventory(mockInventory)
      setPurchaseOrders(mockPurchaseOrders)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Computed values
  const approved = requests.filter(r => r.status === "APPROVED")
  const lowStock = inventory.filter((i: any) => i.stockLevel === "LOW" || i.stockLevel === "CRITICAL").length
  const inTransit = purchaseOrders.filter((p: any) => p.status === "SENT").length

  const stats = [
    {
      label: "Approved Requests",
      value: approved.length,
      icon: ClipboardList,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      trend: approved.length > 0 ? "Ready to process" : "None pending",
    },
    {
      label: "Inventory Items",
      value: inventory.length,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: lowStock > 0 ? `${lowStock} need attention` : "All stocked",
    },
    {
      label: "Purchase Orders",
      value: purchaseOrders.length,
      icon: ShoppingCart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: inTransit > 0 ? `${inTransit} in transit` : "None in transit",
    },
    {
      label: "Vendors",
      value: vendors.length,
      icon: Truck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Active vendors",
    },
  ]

  // PO status breakdown for pie chart
  const poStatusData = Object.entries(
    purchaseOrders.reduce((acc: Record<string, number>, po: any) => {
      acc[po.status] = (acc[po.status] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Inventory chart data
  const inventoryData = inventory.map((i: any) => ({
    name: i.material?.length > 12 ? i.material.substring(0, 12) + "..." : i.material,
    quantity: i.quantity,
    level: i.stockLevel,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            Procurement Dashboard
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {usingMock ? "Showing demo data — backend offline" : "Manage purchasing and vendor operations"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && !loading && (
            <span className="text-xs text-slate-400 hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-muted-foreground bg-slate-100 dark:bg-muted px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={() => navigate("/app/procurement/purchase-orders")}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Purchase Order
          </button>
        </div>
      </div>

      {/* Mock warning */}
      {usingMock && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          Backend unavailable — showing demo data. Real data will load when backend is connected.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-12" />
                </div>
              </div>
              <Skeleton className="h-3 w-28 mt-3" />
            </div>
          ))
          : stats.map(s => (
            <div
              key={s.label}
              className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-foreground">{s.value}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-muted-foreground mt-3">{s.trend}</p>
            </div>
          ))
        }
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory stock levels */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-teal-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-foreground">
              Inventory stock levels
            </h2>
          </div>
          {loading ? (
            <div className="flex items-end gap-2 h-[200px]">
              {[40, 70, 55, 80, 45, 60].map((h, i) => (
                <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
              ))}
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={inventoryData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#8B949E" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#8B949E" }} axisLine={false} tickLine={false} width={85} />
                  <Tooltip contentStyle={{ background: "#161B22", border: "0.5px solid #30363D", borderRadius: "8px", fontSize: "12px", color: "#E6EDF3" }} />
                  <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
                    {inventoryData.map((entry: any, index: number) => (
                      <Cell key={`inv-${index}`} fill={entry.level === "CRITICAL" ? "#F85149" : entry.level === "LOW" ? "#E3B341" : "#1D9E75"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                <span className="text-xs flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />OK</span>
                <span className="text-xs flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Low</span>
                <span className="text-xs flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Critical</span>
              </div>
            </>
          )}
        </div>

        {/* PO status breakdown */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-foreground mb-4">
            Purchase order status
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-[200px]">
              <Skeleton className="w-32 h-32 rounded-full" />
            </div>
          ) : poStatusData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
              No purchase orders yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={poStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {poStatusData.map((entry, index) => (
                    <Cell key={`po-${index}`} fill={PO_COLORS[entry.name] || "#8B949E"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#161B22", border: "0.5px solid #30363D", borderRadius: "8px", fontSize: "12px", color: "#E6EDF3" }} />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: "12px", color: "#8B949E" }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approved requests */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-500" />
              <h2 className="text-base font-semibold">Approved requests</h2>
              {!loading && approved.length > 0 && (
                <span className="bg-teal-500/10 text-teal-600 text-xs px-2 py-0.5 rounded-full font-medium">
                  {approved.length}
                </span>
              )}
            </div>
            <button onClick={() => navigate("/app/procurement/requests")} className="text-xs text-teal-500 hover:text-teal-400">
              View all
            </button>
          </div>
          <div className="p-4 space-y-3">
            {loading
              ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
              : approved.length === 0
                ? <p className="text-center text-sm text-slate-400 py-4">No approved requests</p>
                : approved.slice(0, 4).map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-foreground">{r.material}</p>
                      <p className="text-xs text-slate-500">Qty: {r.quantity} · {r.location}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))
            }
          </div>
        </div>

        {/* Recent purchase orders */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-500" />
              <h2 className="text-base font-semibold">Recent purchase orders</h2>
            </div>
            <button onClick={() => navigate("/app/procurement/purchase-orders")} className="text-xs text-teal-500 hover:text-teal-400">
              View all
            </button>
          </div>
          <div className="p-4 space-y-3">
            {loading
              ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
              : purchaseOrders.length === 0
                ? <p className="text-center text-sm text-slate-400 py-4">No purchase orders yet</p>
                : purchaseOrders.slice(0, 4).map((po: any) => (
                  <div key={po.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted">
                    <div>
                      <p className="font-medium text-sm text-slate-900 dark:text-foreground">{po.material}</p>
                      <p className="text-xs text-slate-500">Qty: {po.quantity} · {po.vendor}</p>
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: `${PO_COLORS[po.status] || "#8B949E"}20`, color: PO_COLORS[po.status] || "#8B949E" }}
                    >
                      {po.status}
                    </span>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}