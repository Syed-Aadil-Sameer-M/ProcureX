import { useEffect, useState } from "react"
import { requestService } from "@/services/requestService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Loader2 } from "lucide-react"

const columns: Column<any>[] = [
  { header: "ID", accessor: "id" },
  { header: "Material", accessor: "material" },
  { header: "Quantity", accessor: "quantity" },
  { header: "Location", accessor: "location" },
  { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { header: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
]

export default function MyRequestsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    requestService.getMy()
      .then(setData)
      .catch(() => setError("Failed to load requests. Please try again."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">My Requests</h1>
        <p className="text-slate-500 dark:text-muted-foreground">All material requests you have submitted</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <DataTable columns={columns} data={data} pageSize={8} />
      )}
    </div>
  )
}