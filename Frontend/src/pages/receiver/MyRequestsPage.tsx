import { useEffect, useState } from "react"
import { requestService } from "@/services/requestService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Loader2, ClipboardList, RefreshCw } from "lucide-react"
import { mockRequests } from "@/lib/mockData"
import ExportButton from "@/components/shared/ExportButton"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"

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
        <p className="text-xs text-slate-500">Qty: {r.quantity}</p>
      </div>
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
]

export default function MyRequestsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await requestService.getAll()
      setData(result)
      setUsingMock(false)
    } catch {
      setData(mockRequests)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleExcelExport = () => {
    const rows = data.map(r => ({
      ID: r.id,
      Material: r.material,
      Quantity: r.quantity,
      Location: r.location,
      Status: r.status,
      Date: new Date(r.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      }),
    }))
    exportToExcel(rows, "My_Requests", "My Requests")
  }

  const handlePDFExport = () => {
    const headers = ["ID", "Material", "Qty", "Location", "Status", "Date"]
    const rows = data.map(r => [
      r.id,
      r.material,
      r.quantity,
      r.location,
      r.status,
      new Date(r.date).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      }),
    ])
    exportToPDF(headers, rows, "My_Requests", "My Material Requests")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            My Requests
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {usingMock ? "Showing demo data — backend offline" : "All material requests you have submitted"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-muted-foreground bg-slate-100 dark:bg-muted px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {!loading && data.length > 0 && (
            <ExportButton
              onExportExcel={handleExcelExport}
              onExportPDF={handlePDFExport}
            />
          )}
        </div>
      </div>

      {/* Mock warning */}
      {usingMock && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          Backend unavailable — showing demo data. Your real requests will appear when backend is connected.
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-slate-400">Loading your requests...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="w-8 h-8 text-teal-500" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-foreground">
            No requests yet
          </h3>
          <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">
            You haven't submitted any material requests yet.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} pageSize={8} />
      )}
    </div>
  )
}