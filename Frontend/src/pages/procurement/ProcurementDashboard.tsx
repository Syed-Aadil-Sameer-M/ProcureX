import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts"
import {
  ClipboardList, Package, ShoppingCart,
  Truck, TrendingUp, Plus
} from "lucide-react"
import { mockRequests, mockInventory, mockPurchaseOrders, mockVendors } from "@/lib/mockData"
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
  const approved = mockRequests.filter(r => r.status === "APPROVED")

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
      value: mockInventory.length,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: `${mockInventory.filter(i => i.stockLevel !== "OK").length} need attention`
    },
    {
      label: "Purchase Orders",
      value: mockPurchaseOrders.length,
      icon: ShoppingCart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: `${mockPurchaseOrders.filter(p => p.status === "SENT").length} in transit`
    },
    {
      label: "Vendors",
      value: mockVendors.length,
      icon: Truck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Active vendors"
    },
  ]

  // PO status breakdown for pie chart
  const poStatusData = Object.entries(
    mockPurchaseOrders.reduce((acc: Record<string, number>, po) => {
      acc[po.status] = (acc[po.status] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Inventory stock levels for bar chart
  const inventoryData = mockInventory.map(i => ({
    name: i.material.length > 12 ? i.material.substring(0, 12) + "..." : i.material,
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
            {approved.slice(0, 4).map(r => (
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
            ))}
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
            {mockPurchaseOrders.map(po => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}