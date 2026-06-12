import { useEffect, useState } from "react"
import { requestService } from "@/services/requestService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import {
  Loader2, CheckCircle, XCircle,
  RefreshCw, ClipboardList
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { mockRequests } from "@/lib/mockData"

export default function PendingRequestsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [dismissedIds, setDismissedIds] = useState<number[]>([])
  const [usingMock, setUsingMock] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      const all = await requestService.getAll()
      setData(all.filter((r: any) => r.status === "PENDING"))
      setUsingMock(false)
    } catch {
      // Fallback to mock data
      setData(mockRequests.filter(r => r.status === "PENDING"))
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleAction = async (id: number, status: "APPROVED" | "REJECTED") => {
    setActionLoading(id)

    // Optimistic UI — immediately dim the row
    setDismissedIds(prev => [...prev, id])

    try {
      await requestService.updateStatus(id, status)
      toast({
        title: status === "APPROVED" ? "✅ Request Approved" : "❌ Request Rejected",
        description: `Request #${id} has been ${status.toLowerCase()} successfully.`,
      })
      // Remove from list after short delay so user sees the dim effect
      setTimeout(() => {
        setData(prev => prev.filter(r => r.id !== id))
        setDismissedIds(prev => prev.filter(d => d !== id))
      }, 400)
    } catch {
      // Revert optimistic update on failure
      setDismissedIds(prev => prev.filter(d => d !== id))
      toast({
        title: "Action Failed",
        description: usingMock
          ? "Backend not connected. This will work when Aadil's API is ready."
          : "Could not complete action. Please try again.",
        variant: "destructive"
      })
    } finally {
      setActionLoading(null)
    }
  }

  const columns: Column<any>[] = [
    {
      header: "ID",
      render: (r) => (
        <span className="text-xs font-mono text-slate-400">#{r.id}</span>
      )
    },
    {
      header: "Material",
      render: (r) => (
        <div>
          <p className="font-medium text-sm text-slate-900 dark:text-foreground">{r.material}</p>
          <p className="text-xs text-slate-500">by {r.requestedBy}</p>
        </div>
      )
    },
    {
      header: "Qty",
      render: (r) => (
        <span className="text-sm font-medium">{r.quantity}</span>
      )
    },
    {
      header: "Location",
      render: (r) => (
        <span className="text-sm text-slate-600 dark:text-muted-foreground">{r.location}</span>
      )
    },
    {
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />
    },
    {
      header: "Date",
      render: (r) => (
        <span className="text-xs text-slate-500">
          {new Date(r.date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
          })}
        </span>
      )
    },
    {
      header: "Actions",
      render: (r) => {
        const isActing = actionLoading === r.id
        const isDismissed = dismissedIds.includes(r.id)
        return (
          <div className={`flex gap-2 transition-opacity duration-300 ${isDismissed ? "opacity-30 pointer-events-none" : ""}`}>
            <button
              onClick={() => handleAction(r.id, "APPROVED")}
              disabled={isActing || isDismissed}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 border border-teal-500/20 disabled:opacity-50 transition-all"
            >
              {isActing
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <CheckCircle className="w-3 h-3" />
              }
              Approve
            </button>
            <button
              onClick={() => handleAction(r.id, "REJECTED")}
              disabled={isActing || isDismissed}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 disabled:opacity-50 transition-all"
            >
              {isActing
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <XCircle className="w-3 h-3" />
              }
              Reject
            </button>
          </div>
        )
      }
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
              Pending Requests
            </h1>
            {!loading && data.length > 0 && (
              <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-semibold px-2.5 py-1 rounded-full">
                {data.length} pending
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-muted-foreground mt-1">
            {usingMock
              ? "Showing demo data — backend offline"
              : "Requests awaiting your approval"
            }
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-teal-600 bg-teal-500/10 px-3 py-1.5 rounded-lg hover:bg-teal-500/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Mock data warning */}
      {usingMock && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          Backend unavailable — approve/reject actions will work once Aadil's API is connected.
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-slate-400">Loading pending requests...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-teal-500" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-foreground">
            All clear!
          </h3>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">
            No pending requests right now.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} pageSize={10} />
      )}
    </div>
  )
}