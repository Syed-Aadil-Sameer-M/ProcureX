import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"
import {
  ClipboardList, Package, ShoppingCart, Clock,
  CheckCircle, TrendingUp, RefreshCw
} from "lucide-react"
import { requestService } from "@/services/requestService"
import { inventoryService } from "@/services/inventoryService"
import { poService } from "@/services/poService"
import { mockRequests, mockInventory, mockPurchaseOrders } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"

const COLORS = {
  PENDING: "#E3B341",
  APPROVED: "#1D9E75",
  REJECTED: "#F85149",
  COMPLETED: "#378ADD",
}

// ── Loading skeleton component ──────────────────────────────────
function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} style={style} />
  )
}

function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-28 mt-3" />
    </div>
  )
}

function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-40 mb-4" />
      <div className="flex items-end gap-2" style={{ height }}>
        {[60, 80, 45, 90, 65, 75, 85].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-lg"
            style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(false)
    try {
      const [req, inv, po] = await Promise.all([
        requestService.getAll(),
        inventoryService.getAll(),
        poService.getAll(),
      ])
      setRequests(req)
      setInventory(inv)
      setPurchaseOrders(po)
      setLastUpdated(new Date())
    } catch {
      // Fallback to mock data if backend not available
      setRequests(mockRequests)
      setInventory(mockInventory)
      setPurchaseOrders(mockPurchaseOrders)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // ── Computed stats ────────────────────────────────────────────
  const pending = requests.filter(r => r.status === "PENDING").length
  const approved = requests.filter(r => r.status === "APPROVED").length
  const rejected = requests.filter(r => r.status === "REJECTED").length
  const completed = requests.filter(r => r.status === "COMPLETED").length
  const lowStock = inventory.filter((i: any) => i.stockLevel === "LOW" || i.stockLevel === "CRITICAL").length
  const activePOs = purchaseOrders.filter((p: any) => p.status !== "COMPLETED").length

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: ClipboardList,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      trend: `${pending} pending action`,
    },
    {
      label: "Pending Approval",
      value: pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: pending > 0 ? "Needs attention" : "All clear",
    },
    {
      label: "Inventory Items",
      value: inventory.length,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: lowStock > 0 ? `${lowStock} low stock` : "All stocked",
    },
    {
      label: "Purchase Orders",
      value: purchaseOrders.length,
      icon: ShoppingCart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: `${activePOs} in progress`,
    },
  ]

  // ── Chart data ────────────────────────────────────────────────
  // Group requests by status for pie chart
  const pieData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
    { name: "Completed", value: completed },
  ].filter(d => d.value > 0)

  // Group requests by day of week for bar chart
  const barData = (() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const counts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 }
    requests.forEach(r => {
      if (r.date) {
        const day = days[new Date(r.date).getDay()]
        counts[day] = (counts[day] || 0) + 1
      }
    })
    // Reorder starting from Mon
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
      day,
      requests: counts[day] || 0
    }))
  })()

  // Inventory chart data
  const inventoryData = inventory.map((i: any) => ({
    name: i.material?.length > 15 ? i.material.substring(0, 15) + "..." : i.material,
    quantity: i.quantity,
    level: i.stockLevel,
  }))

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {error ? "Showing mock data — backend offline" : "System-wide overview and management"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && !loading && (
            <span className="text-xs text-slate-400">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-teal-600 bg-teal-500/10 px-3 py-1.5 rounded-lg hover:bg-teal-500/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh"}
          </button>
          <div className="flex items-center gap-2 text-sm text-teal-600 bg-teal-500/10 px-3 py-1.5 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            {error ? "Mock data" : "Live data"}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          Backend unavailable — showing demo data. Real data will load when backend is connected.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map(s => (
            <div key={s.label} className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
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
        {/* Bar chart */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          {loading ? <ChartSkeleton /> : (
            <>
              <h2 className="text-base font-semibold mb-4 text-slate-900 dark:text-foreground">
                Requests by day
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8B949E" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#8B949E" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#161B22", border: "0.5px solid #30363D", borderRadius: "8px", fontSize: "12px", color: "#E6EDF3" }} />
                  <Bar dataKey="requests" fill="#1D9E75" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          {loading ? <ChartSkeleton /> : (
            <>
              <h2 className="text-base font-semibold mb-4 text-slate-900 dark:text-foreground">
                Request status breakdown
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name.toUpperCase() as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#161B22", border: "0.5px solid #30363D", borderRadius: "8px", fontSize: "12px", color: "#E6EDF3" }} />
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: "12px", color: "#8B949E" }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>

      {/* Inventory chart */}
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
        {loading ? <ChartSkeleton height={200} /> : (
          <>
            <h2 className="text-base font-semibold mb-4 text-slate-900 dark:text-foreground">
              Inventory stock levels
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={inventoryData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12, fill: "#8B949E" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#8B949E" }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={{ background: "#161B22", border: "0.5px solid #30363D", borderRadius: "8px", fontSize: "12px", color: "#E6EDF3" }} />
                <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
                  {inventoryData.map((entry: any, index: number) => (
                    <Cell key={index} fill={entry.level === "CRITICAL" ? "#F85149" : entry.level === "LOW" ? "#E3B341" : "#1D9E75"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              <span className="text-xs flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />OK</span>
              <span className="text-xs flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Low</span>
              <span className="text-xs flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Critical</span>
            </div>
          </>
        )}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold">Pending Requests</h2>
          </div>
          <div className="p-4 space-y-3">
            {loading
              ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
              : requests.filter(r => r.status === "PENDING").slice(0, 4).map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted">
                  <div>
                    <p className="font-medium text-sm">{r.material}</p>
                    <p className="text-xs text-slate-500">by {r.requestedBy} · Qty: {r.quantity}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            }
            {!loading && requests.filter(r => r.status === "PENDING").length === 0 && (
              <p className="text-center text-sm text-slate-400 py-4">No pending requests</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-semibold">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-3">
            {loading
              ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
              : requests.filter(r => r.status !== "PENDING").slice(0, 4).map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted">
                  <div>
                    <p className="font-medium text-sm">{r.material}</p>
                    <p className="text-xs text-slate-500">{r.date}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            }
            {!loading && requests.filter(r => r.status !== "PENDING").length === 0 && (
              <p className="text-center text-sm text-slate-400 py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}