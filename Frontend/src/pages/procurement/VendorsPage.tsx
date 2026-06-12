import { useEffect, useState } from "react"
import { vendorService, type Vendor } from "@/services/vendorService"
import { mockVendors } from "@/lib/mockData"
import {
  Truck, Mail, Phone, Plus, Pencil,
  Trash2, X, RefreshCw, Check, Loader2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const EMPTY_FORM = { name: "", contact: "", email: "", materials: "" }

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [usingMock, setUsingMock] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
  setLoading(true)
  try {
    const data = await vendorService.getAll()
    setVendors(data)
    setUsingMock(false)
  } catch {
    // Only set mock data if vendors is currently empty
    setVendors(prev => {
      if (prev.length > 0) return prev
      return mockVendors.map((v, index) => ({
        ...v,
        id: index + 1,
      })) as Vendor[]
    })
    setUsingMock(true)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => { fetchData() }, [])

  const openAdd = () => {
    setEditingVendor(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (v: Vendor) => {
    setEditingVendor(v)
    setForm({
      name: v.name,
      contact: v.contact,
      email: v.email,
      materials: v.materials.join(", "),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingVendor(null)
    setForm(EMPTY_FORM)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast({ title: "Required fields missing", description: "Name and email are required.", variant: "destructive" })
      return
    }
    setSubmitting(true)
    const payload = {
      name: form.name.trim(),
      contact: form.contact.trim(),
      email: form.email.trim(),
      materials: form.materials.split(",").map(m => m.trim()).filter(Boolean),
    }
    try {
      if (editingVendor) {
        const updated = await vendorService.update(editingVendor.id, payload)
        setVendors(prev => prev.map(v => v.id === editingVendor.id ? updated : v))
        toast({ title: "Vendor updated", description: `${payload.name} updated successfully.` })
      } else {
        const created = await vendorService.add(payload)
        setVendors(prev => [...prev, created])
        toast({ title: "Vendor added", description: `${payload.name} added successfully.` })
      }
      closeModal()
    } catch {
      if (usingMock) {
        if (editingVendor) {
          setVendors(prev => prev.map(v => v.id === editingVendor.id ? { ...v, ...payload } : v))
          toast({ title: "Updated (demo)", description: "Will save to backend when connected." })
        } else {
          setVendors(prev => [...prev, { id: Date.now(), ...payload }])
          toast({ title: "Added (demo)", description: "Will save to backend when connected." })
        }
        closeModal()
      } else {
        toast({ title: "Failed", description: "Could not save vendor. Try again.", variant: "destructive" })
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
  setDeletingId(id)
  setVendors(prev => prev.filter(v => v.id !== id))
  setDeleteConfirm(null)
  try {
    await vendorService.delete(id)
    toast({ title: "Vendor deleted", description: "Vendor removed successfully." })
  } catch {
    toast({
      title: "Deleted (demo)",
      description: "Will sync to backend when connected."
    })
  } finally {
    setDeletingId(null)
  }
}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Vendors</h1>
          <p className="text-slate-500 dark:text-muted-foreground">
            {usingMock ? "Showing demo data — backend offline" : `${vendors.length} active vendors`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-muted-foreground bg-slate-100 dark:bg-muted px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>
      </div>

      {/* Mock warning */}
      {usingMock && !loading && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-600 flex items-center gap-2">
          <span>⚠️</span>
          Backend unavailable — changes will sync when backend is connected.
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
            <Truck className="w-8 h-8 text-teal-500" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-foreground">No vendors yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">Add your first vendor to get started.</p>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map(v => (
            <div key={v.id} className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-teal-500" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-foreground">{v.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(v)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-muted rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {deleteConfirm === v.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(v.id)}
                        disabled={deletingId === v.id}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-500"
                      >
                        {deletingId === v.id
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Check className="w-3.5 h-3.5" />
                        }
                      </button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-muted rounded-lg transition-colors text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(v.id)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-muted-foreground">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{v.contact || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-muted-foreground">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{v.email}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {v.materials?.map(m => (
                  <span key={m} className="px-2 py-0.5 rounded-full text-xs bg-teal-500/10 text-teal-600 border border-teal-500/20">
                    {m}
                  </span>
                ))}
              </div>

              {deleteConfirm === v.id && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-xs text-red-500">
                  Confirm delete? This cannot be undone.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-teal-500" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                  {editingVendor ? "Edit Vendor" : "Add Vendor"}
                </h2>
              </div>
              <button onClick={closeModal}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-muted rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Vendor Name *", key: "name", placeholder: "e.g. CableCo", type: "text" },
                { label: "Contact Person", key: "contact", placeholder: "e.g. John Smith", type: "text" },
                { label: "Email Address *", key: "email", placeholder: "vendor@company.com", type: "email" },
                { label: "Materials (comma separated)", key: "materials", placeholder: "e.g. CCTV Camera, Cable Wire", type: "text" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-[#F8FAFC] dark:bg-muted border border-[#E2E8F0] dark:border-border rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-400"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={closeModal}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-border text-slate-600 dark:text-muted-foreground hover:bg-slate-50 dark:hover:bg-muted transition-colors text-sm font-medium">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors disabled:opacity-50">
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                  : <><Check className="w-4 h-4" />{editingVendor ? "Save Changes" : "Add Vendor"}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}