import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"
import {
  ClipboardList, Package, ShoppingCart, Clock,
  CheckCircle, TrendingUp
} from "lucide-react"
import { mockRequests, mockInventory, mockPurchaseOrders } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"

const COLORS = {
  PENDING: "#E3B341",
  APPROVED: "#1D9E75",
  REJECTED: "#F85149",
  COMPLETED: "#378ADD",
}

export default function AdminDashboard() {
  const pending = mockRequests.filter(r => r.status === "PENDING").length
  const approved = mockRequests.filter(r => r.status === "APPROVED").length
  const rejected = mockRequests.filter(r => r.status === "REJECTED").length
  const completed = mockRequests.filter(r => r.status === "COMPLETED").length

  const stats = [
    {
      label: "Total Requests",
      value: mockRequests.length,
      icon: ClipboardList,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      trend: "+12% this week"
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
      value: mockInventory.length,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      trend: "2 low stock"
    },
    {
      label: "Purchase Orders",
      value: mockPurchaseOrders.length,
      icon: ShoppingCart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      trend: "3 in progress"
    },
  ]

  // Data for bar chart — requests per day (mock)
  const barData = [
    { day: "Mon", requests: 3 },
    { day: "Tue", requests: 5 },
    { day: "Wed", requests: 2 },
    { day: "Thu", requests: 8 },
    { day: "Fri", requests: 4 },
    { day: "Sat", requests: 6 },
    { day: "Sun", requests: 7 },
  ]

  // Data for pie chart — status breakdown
  const pieData = [
    { name: "Pending", value: pending },
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
    { name: "Completed", value: completed },
  ]

  // Inventory stock levels for bar chart
  const inventoryData = mockInventory.map(i => ({
    name: i.material.length > 15 ? i.material.substring(0, 15) + "..." : i.material,
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
            System-wide overview and management
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-teal-600 bg-teal-500/10 px-3 py-1.5 rounded-lg">
          <TrendingUp className="w-4 h-4" />
          Live overview
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
        {/* Bar chart — requests this week */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <h2 className="text-base font-semibold mb-4 text-slate-900 dark:text-foreground">
            Requests this week
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
                    fill={COLORS[entry.name.toUpperCase() as keyof typeof COLORS]}
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
            {mockRequests.filter(r => r.status === "PENDING").map(r => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"
              >
                <div>
                  <p className="font-medium text-sm">{r.material}</p>
                  <p className="text-xs text-slate-500">
                    by {r.requestedBy} · Qty: {r.quantity}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-semibold">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-3">
            {mockRequests.filter(r => r.status !== "PENDING").slice(0, 4).map(r => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"
              >
                <div>
                  <p className="font-medium text-sm">{r.material}</p>
                  <p className="text-xs text-slate-500">{r.date}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}