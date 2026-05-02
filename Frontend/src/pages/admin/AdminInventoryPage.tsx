import { mockInventory } from "@/lib/mockData"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"

type Inv = typeof mockInventory[0]
const columns: Column<Inv>[] = [
  { header: "Material", accessor: "material" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Price", render: (i) => `$${i.price.toFixed(2)}` },
  { header: "Stock Level", render: (i) => <StatusBadge status={i.stockLevel} /> },
]

export default function AdminInventoryPage() { return (<div className="space-y-6"><div><h1 className="text-2xl font-bold">Inventory</h1><p className="text-muted-foreground">Current stock levels</p></div><DataTable columns={columns} data={mockInventory} /></div>) }
