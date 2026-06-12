import { useEffect, useState } from "react"
import { poService } from "@/services/poService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { mockPurchaseOrders } from "@/lib/mockData"
import { Loader2, ShoppingCart, RefreshCw, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ExportButton from "@/components/shared/ExportButton"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"

const PO_STATUSES = ["CREATED", "SENT", "RECEIVED", "COMPLETED"]

const STATUS_COLORS: Record<string, string> = {
  CREATED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  SENT: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  RECEIVED: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  COMPLETED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
}

export default function PurchaseOrdersPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await poService.getAll()
      setData(result)
      setUsingMock(false)
    } catch {
      setData(mockPurchaseOrders)
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id)
    try {
      await poService.updateStatus(id, newStatus)
      setData(prev => prev.map(po =>
        po.id === id ? { ...po, status: newStatus } : po
      ))
      toast({ title: "Status updated", description: `Purchase order status changed to ${newStatus}` })
    } catch {
      toast({
        title: usingMock ? "Demo mode" : "Update failed",
        description: usingMock
          ? "Status update will work once backend is connected."
          : "Could not update status. Try again.",
        variant: "destructive"
      })
      if (usingMock) {
        setData(prev => prev.map(po =>
          po.id === id ? { ...po, status: newStatus } : po
        ))
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const handleExcelExport = () => {
    exportToExcel(
      data.map(po => ({
        ID: po.id,
        Material: po.material,
        Quantity: po.quantity,
        Vendor: po.vendor,
        Status: po.status,
        Date: new Date(po.date).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric"
        }),
      })),
      "Purchase_Orders", "Purchase Orders"
    )
  }

  const handlePDFExport = () => {
    exportToPDF(
      ["ID", "Material", "Qty", "Vendor", "Status", "Date"],
      data.map(po => [
        po.id, po.material, po.quantity, po.vendor, po.status,
        new Date(po.date).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric"
        }),
      ]),
      "Purchase_Orders", "Purchase Orders Report"
    )
  }

  const columns: Column<any>[] = [
    {
      header: "ID",
      render: (p) => <span className="text-xs font-mono text-slate-400">#{p.id}</span>
    },
    {
      header: "Material",
      render: (p) => (
        <div>
          <p className="font-medium text-sm text-slate-900 dark:text-foreground">{p.material}</p>
          <p className="text-xs text-slate-500">Qty: {p.quantity}</p>
        </div>
      )
    },
    {
      header: "Vendor",
      render: (p) => (
        <span className="text-sm text-slate-600 dark:text-muted-foreground">{p.vendor}</span>
      )
    },
    {
      header: "Status",
      render: (p) => <StatusBadge status={p.status} />
    },
    {
      header: "Date",
      render: (p) => (
        <span className="text-xs text-slate-500">
          {new Date(p.date).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
          })}
        </span>
      )
    },
    {
      header: "Update Status",
      render: (p) => (
        <div className="relative">
          {updatingId === p.id ? (
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              Updating...
            </div>
          ) : (
            <div className="relative inline-block">
              <select
                value={p.status}
                onChange={e => handleStatusChange(p.id, e.target.value)}
                className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border cursor-pointer outline-none transition-all ${STATUS_COLORS[p.status] || "bg-slate-100 text-slate-600"}`}
              >
                {PO_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
            </div>
          )}
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            Purchase Orders
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {usingMock ? "Showing demo data — backend offline" : "Track and manage procurement orders"}
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
          Backend unavailable — status updates will work once backend is connected.
        </div>
      )}

      {/* Summary badges */}
      {!loading && data.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {PO_STATUSES.map(s => {
            const count = data.filter(po => po.status === s).length
            if (count === 0) return null
            return (
              <div
                key={s}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${STATUS_COLORS[s]}`}
              >
                {s} <span className="font-bold">{count}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-slate-400">Loading purchase orders...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-foreground">
            No purchase orders yet
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Purchase orders will appear here once created.
          </p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} pageSize={10} />
      )}
    </div>
  )
}