import { useEffect, useState } from "react"
import { requestService } from "@/services/requestService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PendingRequestsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchData = () => {
    setLoading(true)
    requestService.getAll()
      .then(all => setData(all.filter((r: any) => r.status === "PENDING")))
      .catch(() => toast({ title: "Error", description: "Failed to load requests", variant: "destructive" }))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleAction = async (id: number, status: string) => {
    setActionLoading(id)
    try {
      await requestService.updateStatus(id, status)
      toast({ title: `Request ${status}`, description: `Request has been ${status.toLowerCase()}.` })
      fetchData()
    } catch {
      toast({ title: "Error", description: "Action failed. Try again.", variant: "destructive" })
    } finally {
      setActionLoading(null)
    }
  }

  const columns: Column<any>[] = [
    { header: "ID", accessor: "id" },
    { header: "Material", accessor: "material" },
    { header: "Qty", accessor: "quantity" },
    { header: "Location", accessor: "location" },
    { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { header: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction(r.id, "APPROVED")}
            disabled={actionLoading === r.id}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 disabled:opacity-50"
          >
            {actionLoading === r.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
            Approve
          </button>
          <button
            onClick={() => handleAction(r.id, "REJECTED")}
            disabled={actionLoading === r.id}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 disabled:opacity-50"
          >
            <XCircle className="w-3 h-3" />
            Reject
          </button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pending Requests</h1>
        <p className="text-muted-foreground">Requests awaiting your approval</p>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  )
}