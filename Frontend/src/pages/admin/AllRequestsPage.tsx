import { useEffect, useState } from "react"
import { requestService } from "@/services/requestService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Loader2 } from "lucide-react"
import ExportButton from "@/components/shared/ExportButton"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"
import { mockRequests } from "@/lib/mockData"

const columns: Column<any>[] = [
  { header: "ID", accessor: "id" },
  { header: "Material", accessor: "material" },
  { header: "Qty", accessor: "quantity" },
  { header: "Location", accessor: "location" },
  { header: "Requested By", accessor: "requestedBy" },
  { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { header: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
]

export default function AllRequestsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    requestService.getAll()
      .then(setData)
      .catch(() => setData(mockRequests))
      .finally(() => setLoading(false))
  }, [])

  const handleExcelExport = () => {
    const rows = data.map(r => ({
      ID: r.id,
      Material: r.material,
      Quantity: r.quantity,
      Location: r.location,
      "Requested By": r.requestedBy,
      Status: r.status,
      Date: new Date(r.date).toLocaleDateString(),
    }))
    exportToExcel(rows, "ProcureX_Requests", "Requests")
  }

  const handlePDFExport = () => {
    const headers = ["ID", "Material", "Qty", "Location", "Requested By", "Status", "Date"]
    const rows = data.map(r => [
      r.id,
      r.material,
      r.quantity,
      r.location,
      r.requestedBy,
      r.status,
      new Date(r.date).toLocaleDateString(),
    ])
    exportToPDF(headers, rows, "ProcureX_Requests", "All Material Requests")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            All Requests
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            Complete request history
          </p>
        </div>
        {!loading && data.length > 0 && (
          <ExportButton
            onExportExcel={handleExcelExport}
            onExportPDF={handlePDFExport}
          />
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <DataTable columns={columns} data={data} pageSize={10} />
      )}
    </div>
  )
}