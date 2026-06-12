import { useEffect, useState } from "react"
import { requestService } from "@/services/requestService"
import { poService } from "@/services/poService"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { mockRequests, mockVendors } from "@/lib/mockData"
import { Loader2, ShoppingCart, X, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ExportButton from "@/components/shared/ExportButton"
import { exportToExcel, exportToPDF } from "@/lib/exportUtils"

export default function ProcurementApprovedRequestsPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [vendorId, setVendorId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const fetchData = async () => {
    setLoading(true)
    try {
      const all = await requestService.getAll()
      setData(all.filter((r: any) => r.status === "APPROVED"))
      setUsingMock(false)
    } catch {
      setData(mockRequests.filter(r => r.status === "APPROVED"))
      setUsingMock(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openModal = (request: any) => {
    setSelectedRequest(request)
    setQuantity(String(request.quantity))
    setVendorId("")
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedRequest(null)
    setVendorId("")
    setQuantity("")
  }

  const handleCreatePO = async () => {
    if (!vendorId) {
      toast({ title: "Select a vendor", description: "Please choose a vendor before creating a PO.", variant: "destructive" })
      return
    }
    if (!quantity || Number(quantity) <= 0) {
      toast({ title: "Invalid quantity", description: "Please enter a valid quantity.", variant: "destructive" })
      return
    }
    setSubmitting(true)
    try {
      await poService.create({
        requestId: selectedRequest.id,
        material: selectedRequest.material,
        vendorId: Number(vendorId),
        quantity: Number(quantity),
      })
      toast({ title: "✅ Purchase Order Created", description: `PO created for ${selectedRequest.material}` })
      closeModal()
    } catch {
      toast({
        title: usingMock ? "Demo mode" : "Failed",
        description: usingMock
          ? "PO creation will work once Aadil's API is connected."
          : "Could not create purchase order. Try again.",
        variant: "destructive"
      })
      if (usingMock) closeModal()
    } finally {
      setSubmitting(false)
    }
  }

  const handleExcelExport = () => {
    exportToExcel(
      data.map(r => ({
        ID: r.id, Material: r.material, Quantity: r.quantity,
        Location: r.location, Status: r.status,
        Date: new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      })),
      "Approved_Requests", "Approved Requests"
    )
  }

  const handlePDFExport = () => {
    exportToPDF(
      ["ID", "Material", "Qty", "Location", "Status", "Date"],
      data.map(r => [r.id, r.material, r.quantity, r.location, r.status,
        new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })]),
      "Approved_Requests", "Approved Requests — Ready for Procurement"
    )
  }

  const columns: Column<any>[] = [
    {
      header: "ID",
      render: (r) => <span className="text-xs font-mono text-slate-400">#{r.id}</span>
    },
    {
      header: "Material",
      render: (r) => (
        <div>
          <p className="font-medium text-sm text-slate-900 dark:text-foreground">{r.material}</p>
          <p className="text-xs text-slate-500">by {r.requestedBy}</p>
        </div>
      )
    },
    {
      header: "Qty",
      render: (r) => <span className="text-sm font-medium">{r.quantity}</span>
    },
    {
      header: "Location",
      render: (r) => <span className="text-sm text-slate-600 dark:text-muted-foreground">{r.location}</span>
    },
    {
      header: "Status",
      render: (r) => <StatusBadge status={r.status} />
    },
    {
      header: "Date",
      render: (r) => (
        <span className="text-xs text-slate-500">
          {new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      )
    },
    {
      header: "Action",
      render: (r) => (
        <button
          onClick={() => openModal(r)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
        >
          <ShoppingCart className="w-3 h-3" />
          Create PO
        </button>
      )
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
            Approved Requests
          </h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {usingMock ? "Showing demo data — backend offline" : "Requests ready for procurement"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-muted-foreground bg-slate-100 dark:bg-muted px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          {!loading && data.length > 0 && (
            <ExportButton onExportExcel={handleExcelExport} onExportPDF={handlePDFExport} />
          )}
        </div>
      </div>

      {/* Mock warning */}
      {usingMock && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          Backend unavailable — Create PO will work once Aadil's API is connected.
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          <p className="text-sm text-slate-400">Loading approved requests...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-8 h-8 text-teal-500" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-foreground">No approved requests</h3>
          <p className="text-sm text-slate-500 mt-1">Approved requests will appear here for processing.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={data} pageSize={10} />
      )}

      {/* Create PO Modal */}
      {modalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">

            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-purple-500" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                  Create Purchase Order
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Request summary */}
            <div className="bg-[#F8FAFC] dark:bg-muted rounded-xl p-4 mb-5">
              <p className="text-xs text-slate-500 mb-1">Creating PO for request</p>
              <p className="font-semibold text-slate-900 dark:text-foreground">
                {selectedRequest.material}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                #{selectedRequest.id} · {selectedRequest.location}
              </p>
            </div>

            {/* Vendor selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Select Vendor *
              </label>
              <select
                value={vendorId}
                onChange={e => setVendorId(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-muted border border-[#E2E8F0] dark:border-border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              >
                <option value="">Choose a vendor...</option>
                {mockVendors.map((v: any) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-muted border border-[#E2E8F0] dark:border-border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                placeholder="Enter quantity"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-border text-slate-600 dark:text-muted-foreground hover:bg-slate-50 dark:hover:bg-muted transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePO}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</>
                  : <><ShoppingCart className="w-4 h-4" />Create PO</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}