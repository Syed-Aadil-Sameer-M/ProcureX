import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts"
import {
  ClipboardList, Clock, CheckCircle,
  XCircle, TrendingUp, Plus, Loader2
} from "lucide-react"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { useNavigate } from "react-router-dom"
import { requestService } from "@/services/requestService"

export default function ReceiverDashboard() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    requestService.getMy()
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load your requests."))
      .finally(() => setLoading(false))
  }, [])

  const myRequests = requests
  const pending = myRequests.filter(r => r.status === "PENDING").length
  const approved = myRequests.filter(r => r.status === "APPROVED").length
  const rejected = myRequests.filter(r => r.status === "REJECTED").length
  const completed = myRequests.filter(r => r.status === "COMPLETED").length

  const stats = [
    {
      label: "My Requests",
      value: myRequests.length,
      icon: ClipboardList,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      trend: "Total submitted"
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      trend: "Awaiting approval"
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
      trend: "Ready to process"
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
      trend: "Need to resubmit"
    },
  ]

  const statusData = [
    { name: "Pending", value: pending, color: "#E3B341" },
    { name: "Approved", value: approved, color: "#1D9E75" },
    { name: "Rejected", value: rejected, color: "#F85149" },
    { name: "Completed", value: completed, color: "#378ADD" },
  ]

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
        <button
          onClick={() => window.location.reload()}
          className="text-teal-600 hover:underline text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            My Dashboard
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            Track your material requests
          </p>
        </div>
        <button
          onClick={() => navigate("/app/receiver/request")}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
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
        {/* Status bar chart */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-teal-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-foreground">
              My request status
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <XAxis
                dataKey="name"
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
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent requests */}
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-foreground">
              Recent requests
            </h2>
            <button
              onClick={() => navigate("/app/receiver/requests")}
              className="text-xs text-teal-500 hover:text-teal-400"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {myRequests.slice(0, 4).map(r => (
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
            {myRequests.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-4">No requests yet.</p>
            )}
          </div>
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