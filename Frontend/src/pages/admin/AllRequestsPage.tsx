import { useEffect, useState } from "react"
import { requestService } from "@/services/requestService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Loader2 } from "lucide-react"

const columns: Column<any>[] = [
  { header: "ID", accessor: "id" },
  { header: "Material", accessor: "material" },
  { header: "Qty", accessor: "quantity" },
  { header: "Location", accessor: "location" },
  { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { header: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
]

export default function AllRequestsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    requestService.getAll()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">All Requests</h1>
        <p className="text-slate-500 dark:text-muted-foreground">Complete request history from backend</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}
