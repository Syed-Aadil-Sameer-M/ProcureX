import { mockAuditLogs } from "@/lib/mockData"
import { DataTable, type Column } from "@/components/shared/DataTable"
import ExportButton from "@/components/shared/ExportButton"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"

type Log = typeof mockAuditLogs[0]

const columns: Column<Log>[] = [
  { header: "User", accessor: "user" },
  { header: "Action", accessor: "action" },
  { header: "Module", accessor: "module" },
  { header: "Description", accessor: "description" },
  { header: "Time", render: (l) => new Date(l.timestamp).toLocaleString() },
]

export default function AuditLogsPage() {
  const handleExcelExport = () => {
    const rows = mockAuditLogs.map(l => ({
      User: l.user,
      Action: l.action,
      Module: l.module,
      Description: l.description,
      Timestamp: new Date(l.timestamp).toLocaleString(),
    }))
    exportToExcel(rows, "ProcureX_AuditLogs", "Audit Logs")
  }

  const handlePDFExport = () => {
    const headers = ["User", "Action", "Module", "Description", "Timestamp"]
    const rows = mockAuditLogs.map(l => [
      l.user,
      l.action,
      l.module,
      l.description,
      new Date(l.timestamp).toLocaleString(),
    ])
    exportToPDF(headers, rows, "ProcureX_AuditLogs", "Audit Logs")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground">Complete activity trail</p>
        </div>
        <ExportButton
          onExportExcel={handleExcelExport}
          onExportPDF={handlePDFExport}
        />
      </div>
      <DataTable columns={columns} data={mockAuditLogs} />
    </div>
  )
}