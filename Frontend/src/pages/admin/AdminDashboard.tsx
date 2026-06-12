import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"
import {
  ClipboardList, Package, ShoppingCart, Clock,
  CheckCircle, TrendingUp, Loader2
} from "lucide-react"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { requestService } from "@/services/requestService"
import { inventoryService } from "@/services/inventoryService"
import { poService } from "@/services/poService"

const COLORS: Record<string, string> = {
  PENDING: "#E3B341",
  APPROVED: "#1D9E75",
  REJECTED: "#F85149",
  COMPLETED: "#378ADD",
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      requestService.getAll(),
      inventoryService.getAll(),
      poService.getAll(),
    ])
      .then(([reqData, invData, poData]) => {
        setRequests(Array.isArray(reqData) ? reqData : [])
        setInventory(Array.isArray(invData) ? invData : [])
        setPurchaseOrders(Array.isArray(poData) ? poData : [])
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false))
  }, [])

  const pending = requests.filter(r => r.status === "PENDING").length
  const approved = requests.filter(r => r.status === "APPROVED").length
  const rejected = requests.filter(r => r.status === "REJECTED").length
  const completed = requests.filter(r => r.status === "COMPLETED").length

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: ClipboardList,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      trend: `${pending} pending`
    },
    {
      label: "Pending Approval",
      value: pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Needs action"
    },
    {
      label: "Inventory Items",
      value: inventory.length,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: `${inventory.filter(i => i.stockLevel && i.stockLevel !== "OK").length} need attention`
    },
    {
      label: "Purchase Orders",
      value: purchaseOrders.length,
      icon: ShoppingCart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: `${purchaseOrders.filter(p => p.status === "SENT").length} in transit`
    },
  ]

  const barData = [
    { day: "Pending", requests: pending },
    { day: "Approved", requests: approved },
    { day: "Rejected", requests: rejected },
    { day: "Completed", requests: completed },
  ]

  const pieData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
    { name: "Completed", value: completed },
  ]

  const inventoryData = inventory.map(i => ({
    name: (i.material && i.material.length > 15) ? i.material.substring(0, 15) + "..." : (i.material || "Unknown"),
    quantity: i.quantity,
    level: i.stockLevel || (i.quantity <= 0 ? "CRITICAL" : i.quantity < (i.minStockLevel || 10) ? "LOW" : "OK"),
  }))

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-teal-600 hover:underline text-sm">Retry</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            System-wide overview and management
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-teal-600 bg-teal-500/10 px-3 py-1.5 rounded-lg">
          <TrendingUp className="w-4 h-4" />
          Live data
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
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
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar chart — status counts */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <h2 className="text-base font-semibold mb-4 text-slate-900 dark:text-foreground">
            Request status overview
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "#8B949E" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#8B949E" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#161B22",
                  border: "0.5px solid #30363D",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#E6EDF3"
                }}
              />
              <Bar dataKey="requests" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — status breakdown */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <h2 className="text-base font-semibold mb-4 text-slate-900 dark:text-foreground">
            Request status breakdown
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name.toUpperCase()] || "#8B949E"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#161B22",
                  border: "0.5px solid #30363D",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#E6EDF3"
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span style={{ fontSize: "12px", color: "#8B949E" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory levels chart */}
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
        <h2 className="text-base font-semibold mb-4 text-slate-900 dark:text-foreground">
          Inventory stock levels
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={inventoryData} layout="vertical">
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#8B949E" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#8B949E" }}
              axisLine={false}
              tickLine={false}
              width={130}
            />
            <Tooltip
              contentStyle={{
                background: "#161B22",
                border: "0.5px solid #30363D",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#E6EDF3"
              }}
            />
            <Bar
              dataKey="quantity"
              radius={[0, 4, 4, 0]}
            >
              {inventoryData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.level === "CRITICAL" ? "#F85149" :
                    entry.level === "LOW" ? "#E3B341" :
                    "#1D9E75"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <span className="text-xs flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>OK
          </span>
          <span className="text-xs flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>Low
          </span>
          <span className="text-xs flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>Critical
          </span>
        </div>
      </div>

      {/* Bottom row — pending requests + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold">Pending Requests</h2>
          </div>
          <div className="p-4 space-y-3">
            {requests.filter(r => r.status === "PENDING").map(r => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"
              >
                <div>
                  <p className="font-medium text-sm">{r.material}</p>
                  <p className="text-xs text-slate-500">
                    by {r.requestedBy || "Unknown"} · Qty: {r.quantity}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {requests.filter(r => r.status === "PENDING").length === 0 && (
              <p className="text-center text-sm text-slate-500 py-4">No pending requests.</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-semibold">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-3">
            {requests.filter(r => r.status !== "PENDING").slice(0, 4).map(r => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"
              >
                <div>
                  <p className="font-medium text-sm">{r.material}</p>
                  <p className="text-xs text-slate-500">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : r.date || ""}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {requests.filter(r => r.status !== "PENDING").length === 0 && (
              <p className="text-center text-sm text-slate-500 py-4">No recent activity.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}