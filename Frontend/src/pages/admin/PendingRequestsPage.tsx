import { mockRequests } from "@/lib/mockData"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import type { Request } from "@/lib/mockData"

const columns: Column<Request>[] = [
  { header: "ID", accessor: "id" },
  { header: "Material", accessor: "material" },
  { header: "Qty", accessor: "quantity" },
  { header: "Requested By", accessor: "requestedBy" },
  { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { header: "Date", accessor: "date" },
]

export default function PendingRequestsPage() {
  const pending = mockRequests.filter(r => r.status === "PENDING")
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Pending Requests</h1><p className="text-muted-foreground">Requests awaiting your approval</p></div>
      <DataTable columns={columns} data={pending} />
    </div>
  )
}
