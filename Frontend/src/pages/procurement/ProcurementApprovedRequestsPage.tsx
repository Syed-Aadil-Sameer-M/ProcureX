import { mockRequests } from "@/lib/mockData"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import type { Request } from "@/lib/mockData"

const columns: Column<Request>[] = [{ header: "ID", accessor: "id" },{ header: "Material", accessor: "material" },{ header: "Qty", accessor: "quantity" },{ header: "Location", accessor: "location" },{ header: "Status", render: (r) => <StatusBadge status={r.status} /> },{ header: "Date", accessor: "date" }]

export default function ProcurementApprovedRequestsPage() {
  const approved = mockRequests.filter(r => r.status === "APPROVED")
  return (<div className="space-y-6"><div><h1 className="text-2xl font-bold">Approved Requests</h1><p className="text-muted-foreground">Requests ready for procurement</p></div><DataTable columns={columns} data={approved} /></div>)
}
