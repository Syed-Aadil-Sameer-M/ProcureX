import { mockRequests } from "@/lib/mockData"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import type { Request } from "@/lib/mockData"

const columns: Column<Request>[] = [
  { header: "ID", accessor: "id" },
  { header: "Material", accessor: "material" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Location", accessor: "location" },
  { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { header: "Date", accessor: "date" },
]

export default function MyRequestsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">My Requests</h1><p className="text-slate-500 dark:text-muted-foreground">All material requests you have submitted</p></div>
      <DataTable columns={columns} data={mockRequests} pageSize={8} />
    </div>
  )
}
