import { mockPurchaseOrders } from "@/lib/mockData"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"

type PO = typeof mockPurchaseOrders[0]
const columns: Column<PO>[] = [{ header: "ID", accessor: "id" },{ header: "Material", accessor: "material" },{ header: "Qty", accessor: "quantity" },{ header: "Vendor", accessor: "vendor" },{ header: "Status", render: (p) => <StatusBadge status={p.status} /> },{ header: "Date", accessor: "date" }]

export default function PurchaseOrdersPage() { return (<div className="space-y-6"><div><h1 className="text-2xl font-bold">Purchase Orders</h1><p className="text-muted-foreground">Track procurement orders</p></div><DataTable columns={columns} data={mockPurchaseOrders} /></div>) }
