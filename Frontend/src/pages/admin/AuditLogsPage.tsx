import { useState, useEffect } from "react"
import { auditLogService } from "@/services/auditLogService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import ExportButton from "@/components/shared/ExportButton"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

type Log = {
  id: number
  user: string
  action: string
  module: string
  description: string
  timestamp: string
}

const columns: Column<Log>[] = [
  { header: "User", accessor: "user" },
  { header: "Action", accessor: "action" },
  { header: "Module", accessor: "module" },
  { header: "Description", accessor: "description" },
  { header: "Time", render: (l) => new Date(l.timestamp).toLocaleString() },
]

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    auditLogService.getAll()
      .then(data => {
        setLogs(data)
        setLoading(false)
      })
      .catch(() => {
        toast({ title: "Error", description: "Failed to load audit logs", variant: "destructive" })
        setLoading(false)
      })
  }, [toast])

  const handleExcelExport = () => {
    const rows = logs.map(l => ({
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
    const rows = logs.map(l => [
      l.user,
      l.action,
      l.module,
      l.description,
      new Date(l.timestamp).toLocaleString(),
    ])
    exportToPDF(headers, rows, "ProcureX_AuditLogs", "Audit Logs")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-24" /></div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
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
      <DataTable columns={columns} data={logs} />
    </div>
  )
}