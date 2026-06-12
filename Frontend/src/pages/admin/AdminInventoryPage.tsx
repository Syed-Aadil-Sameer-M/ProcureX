import { useEffect, useState } from "react"
import { inventoryService, type InventoryItem } from "@/services/inventoryService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import ExportButton from "@/components/shared/ExportButton"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

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
  const { toast } = useToast()

  useEffect(() => {
    inventoryService.getAll()
      .then(setData)
      .catch(() => toast({ title: "Error", description: "Failed to load inventory", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [toast])

  const handleExcelExport = () => {
    const rows = data.map(i => ({
      Material: i.material,
      Quantity: i.quantity,
      Unit: i.unit,
      "Min Stock Level": i.minStockLevel,
      "Price ($)": i.price.toFixed(2),
      "Stock Level": i.stockLevel,
    }))
    exportToExcel(rows, "ProcureX_Inventory", "Inventory")
  }

  const handlePDFExport = () => {
    const headers = ["Material", "Qty", "Unit", "Min Level", "Price ($)", "Stock Level"]
    const rows = data.map(i => [
      i.material,
      i.quantity,
      i.unit,
      i.minStockLevel,
      `$${i.price.toFixed(2)}`,
      i.stockLevel,
    ])
    exportToPDF(headers, rows, "ProcureX_Inventory", "Inventory Report")
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
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Current stock levels</p>
        </div>
        {data.length > 0 && (
          <ExportButton
            onExportExcel={handleExcelExport}
            onExportPDF={handlePDFExport}
          />
        )}
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}