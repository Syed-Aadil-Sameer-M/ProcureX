import { useEffect, useState } from "react"
import { inventoryService, type InventoryItem } from "@/services/inventoryService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Loader2 } from "lucide-react"

const columns: Column<InventoryItem>[] = [
  { header: "Material", accessor: "material" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Price", render: (i) => `$${i.price?.toFixed(2) || '0.00'}` },
  { header: "Stock Level", render: (i) => <StatusBadge status={i.stockLevel} /> },
]

export default function AdminInventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    inventoryService.getAll()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Inventory</h1>
        <p className="text-slate-500 dark:text-muted-foreground">Current stock levels in real-time</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}
