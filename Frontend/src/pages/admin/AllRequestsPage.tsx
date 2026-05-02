import { mockRequests } from "@/lib/mockData"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import type { Request } from "@/lib/mockData"

const columns: Column<Request>[] = [
  { header: "ID", accessor: "id" },
  { header: "Material", accessor: "material" },
  { header: "Qty", accessor: "quantity" },
  { header: "Requested By", accessor: "requestedBy" },
  { header: "Location", accessor: "location" },
  { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { header: "Date", accessor: "date" },
]

export default function AllRequestsPage() { return (<div className="space-y-6"><div><h1 className="text-2xl font-bold">All Requests</h1><p className="text-muted-foreground">Complete request history</p></div><DataTable columns={columns} data={mockRequests} /></div>) }
