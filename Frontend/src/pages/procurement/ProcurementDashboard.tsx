import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts"
import {
  ClipboardList, Package, ShoppingCart,
  Truck, TrendingUp, Plus, Loader2, AlertTriangle, RefreshCw
} from "lucide-react"
import { requestService } from "@/services/requestService"
import { inventoryService } from "@/services/inventoryService"
import { poService } from "@/services/poService"
import { vendorService } from "@/services/vendorService"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { useNavigate } from "react-router-dom"

const PO_COLORS: Record<string, string> = {
  CREATED: "#378ADD",
  SENT: "#E3B341",
  RECEIVED: "#1D9E75",
  COMPLETED: "#8B949E",
}

export default function ProcurementDashboard() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      requestService.getAll(),
      inventoryService.getAll(),
      poService.getAll(),
      vendorService.getAll()
    ])
      .then(([reqData, invData, poData, vendData]) => {
        setRequests(Array.isArray(reqData) ? reqData : [])
        setInventory(Array.isArray(invData) ? invData : [])
        setPurchaseOrders(Array.isArray(poData) ? poData : [])
        setVendors(Array.isArray(vendData) ? vendData : [])
      })
      .catch((err) => setError(err.message || "Failed to load dashboard data"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-500" />
        <p className="text-slate-600 dark:text-muted-foreground">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    )
  }

  const approved = requests.filter(r => r.status === "APPROVED")

  const stats = [
    {
      label: "Approved Requests",
      value: approved.length,
      icon: ClipboardList,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      trend: "Ready to process"
    },
    {
      label: "Inventory Items",
      value: inventory.length,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: `${inventory.filter(i => i.stockLevel !== "OK").length} need attention`
    },
    {
      label: "Purchase Orders",
      value: purchaseOrders.length,
      icon: ShoppingCart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: `${purchaseOrders.filter(p => p.status === "SENT").length} in transit`
    },
    {
      label: "Vendors",
      value: vendors.length,
      icon: Truck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Active vendors"
    },
  ]

  // PO status breakdown for pie chart
  const poStatusData = Object.entries(
    purchaseOrders.reduce((acc: Record<string, number>, po) => {
      acc[po.status] = (acc[po.status] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Inventory stock levels for bar chart
  const inventoryData = inventory.map(i => ({
    name: i.material && i.material.length > 12 ? i.material.substring(0, 12) + "..." : i.material,
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
            Manage purchasing and vendor operations
          </p>
        </div>
        <button
          onClick={() => navigate("/app/procurement/purchase-orders")}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Purchase Order
        </button>
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
        {/* Inventory stock levels */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-teal-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-foreground">
              Inventory stock levels
            </h2>
          </div>
          {inventoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={inventoryData} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#8B949E" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#8B949E" }}
                  axisLine={false}
                  tickLine={false}
                  width={85}
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
                <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
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
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
              No inventory data available
            </div>
          )}
          <div className="flex gap-4 mt-2">
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

        {/* PO status breakdown */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-foreground mb-4">
            Purchase order status
          </h2>
          {poStatusData.length > 0 ? (
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
                >
                  {poStatusData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={PO_COLORS[entry.name] || "#8B949E"}
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
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
              No purchase orders yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approved requests ready to process */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-teal-500" />
              <h2 className="text-base font-semibold">Approved requests</h2>
            </div>
            <button
              onClick={() => navigate("/app/procurement/requests")}
              className="text-xs text-teal-500 hover:text-teal-400"
            >
              View all
            </button>
          </div>
          <div className="p-4 space-y-3">
            {approved.length > 0 ? (
              approved.slice(0, 4).map(r => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-foreground">
                      {r.material}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty: {r.quantity} · {r.location}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-muted-foreground text-sm">No approved requests</p>
            )}
          </div>
        </div>

        {/* Recent purchase orders */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-purple-500" />
              <h2 className="text-base font-semibold">Recent purchase orders</h2>
            </div>
            <button
              onClick={() => navigate("/app/procurement/purchase-orders")}
              className="text-xs text-teal-500 hover:text-teal-400"
            >
              View all
            </button>
          </div>
          <div className="p-4 space-y-3">
            {purchaseOrders.length > 0 ? (
              purchaseOrders.map(po => (
                <div
                  key={po.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-foreground">
                      {po.material}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty: {po.quantity} · {po.vendor}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      background: `${PO_COLORS[po.status]}20`,
                      color: PO_COLORS[po.status]
                    }}
                  >
                    {po.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-muted-foreground text-sm">No purchase orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}