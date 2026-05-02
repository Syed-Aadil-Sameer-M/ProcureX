import { mockVendors } from "@/lib/mockData"
import { Truck, Mail } from "lucide-react"

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Vendors</h1><p className="text-muted-foreground">Manage vendor relationships</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{mockVendors.map(v => (<div key={v.id} className="bg-card border rounded-xl p-5 space-y-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center"><Truck className="w-5 h-5 text-teal-500" /></div><h3 className="font-semibold text-lg">{v.name}</h3></div><div className="space-y-1 text-sm"><div className="flex items-center gap-2 text-muted-foreground"><span>Contact: {v.contact}</span></div><div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" />{v.email}</div></div><div className="flex flex-wrap gap-1 pt-2">{v.materials.map(m => (<span key={m} className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">{m}</span>))}</div></div>))}</div>
    </div>
  )
}
