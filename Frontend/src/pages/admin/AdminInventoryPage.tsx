import { useEffect, useState } from "react"
import { inventoryService, type InventoryItem } from "@/services/inventoryService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { Loader2 } from "lucide-react"

const stockBadge = (level: string) => {
  const styles: Record<string, string> = {
    OK: "bg-teal-500/10 text-teal-600",
    LOW: "bg-amber-500/10 text-amber-500",
    CRITICAL: "bg-red-500/10 text-red-500",
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[level] || styles.OK}`}>
      {level}
    </span>
  )
}

const columns: Column<InventoryItem>[] = [
  { header: "Material", accessor: "material" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Unit", accessor: "unit" },
  { header: "Min Level", accessor: "minStockLevel" },
  { header: "Price", render: (r) => `$${r.price.toFixed(2)}` },
  { header: "Stock Level", render: (r) => stockBadge(r.stockLevel) },
]

export default function AdminInventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    inventoryService.getAll()
      .then(setData)
      .catch(() => setError("Failed to load inventory."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-muted-foreground">Current stock levels</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}