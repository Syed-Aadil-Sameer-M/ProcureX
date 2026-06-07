import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts"
import {
  ClipboardList, Clock, CheckCircle,
  XCircle, TrendingUp, Plus, RefreshCw
} from "lucide-react"
import { requestService } from "@/services/requestService"
import { mockRequests } from "@/lib/mockData"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { useNavigate } from "react-router-dom"

function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} style={style} />
  )
}

export default function ReceiverDashboard() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await requestService.getAll()
      setRequests(data)
      setUsingMock(false)
      setLastUpdated(new Date())
    } catch {
      setRequests(mockRequests)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Computed stats from real data
  const pending = requests.filter(r => r.status === "PENDING").length
  const approved = requests.filter(r => r.status === "APPROVED").length
  const rejected = requests.filter(r => r.status === "REJECTED").length
  const completed = requests.filter(r => r.status === "COMPLETED").length

  const stats = [
    {
      label: "My Requests",
      value: requests.length,
      icon: ClipboardList,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      trend: "Total submitted",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: pending > 0 ? "Awaiting approval" : "None pending",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "Ready to process",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      trend: rejected > 0 ? "Need to resubmit" : "None rejected",
    },
  ]

  // Bar chart — status breakdown
  const statusData = [
    { name: "Pending", value: pending, color: "#E3B341" },
    { name: "Approved", value: approved, color: "#1D9E75" },
    { name: "Rejected", value: rejected, color: "#F85149" },
    { name: "Completed", value: completed, color: "#378ADD" },
  ].filter(d => d.value > 0)

  // Donut chart — same data
  const donutData = statusData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            My Dashboard
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {usingMock ? "Showing demo data — backend offline" : "Track your material requests"}
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
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-muted-foreground bg-slate-100 dark:bg-muted px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button
            onClick={() => navigate("/app/receiver/create")}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Mock warning */}
      {usingMock && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          Backend unavailable — showing demo data. Real requests will appear when backend is connected.
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
        {/* Bar chart */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-teal-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-foreground">
              My request status
            </h2>
          </div>
          {loading ? (
            <div className="space-y-2">
              <div className="flex items-end gap-2 h-[200px]">
                {[60, 80, 45, 90].map((h, i) => (
                  <Skeleton key={i} className="flex-1 rounded-t-lg" style={{ height: `${h}%` } as React.CSSProperties} />
                ))}
              </div>
            </div>
          ) : statusData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
              No requests yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8B949E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#8B949E" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#161B22", border: "0.5px solid #30363D", borderRadius: "8px", fontSize: "12px", color: "#E6EDF3" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut chart — status distribution */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-foreground mb-4">
            Status distribution
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-[200px]">
              <Skeleton className="w-32 h-32 rounded-full" />
            </div>
          ) : donutData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-slate-400 text-sm">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                >
                  {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#161B22", border: "0.5px solid #30363D", borderRadius: "8px", fontSize: "12px", color: "#E6EDF3" }} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: "12px", color: "#8B949E" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent requests */}
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
        <div className="p-5 border-b border-[#E2E8F0] dark:border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-foreground">
            Recent requests
          </h2>
          <button
            onClick={() => navigate("/app/receiver/requests")}
            className="text-xs text-teal-500 hover:text-teal-400 transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="p-4 space-y-3">
          {loading
            ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
            : requests.length === 0
              ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No requests yet. Create your first request!
                </div>
              )
              : requests.slice(0, 4).map(r => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-900 dark:text-foreground">
                      {r.material}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty: {r.quantity} · {r.location} · {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))
          }
        </div>
      </div>

      {/* Quick action */}
      <div
        onClick={() => navigate("/app/receiver/create")}
        className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:bg-teal-500/20 transition-colors"
      >
        <div>
          <h3 className="font-semibold text-teal-600 dark:text-teal-400">
            Need materials?
          </h3>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">
            Create a new material request and get it approved fast
          </p>
        </div>
        <Plus className="w-8 h-8 text-teal-500 flex-shrink-0" />
      </div>
    </div>
  )
}