import { mockAuditLogs } from "@/lib/mockData"
import { DataTable, type Column } from "@/components/shared/DataTable"

type Log = typeof mockAuditLogs[0]
const columns: Column<Log>[] = [
  { header: "User", accessor: "user" },
  { header: "Action", accessor: "action" },
  { header: "Module", accessor: "module" },
  { header: "Description", accessor: "description" },
  { header: "Time", render: (l) => new Date(l.timestamp).toLocaleString() },
]

export default function AuditLogsPage() { return (<div className="space-y-6"><div><h1 className="text-2xl font-bold">Audit Logs</h1><p className="text-muted-foreground">Activity trail</p></div><DataTable columns={columns} data={mockAuditLogs} /></div>) }
