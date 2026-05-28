import { useState } from "react"
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"

interface ExportButtonProps {
  onExportExcel: () => void
  onExportPDF: () => void
}

export default function ExportButton({ onExportExcel, onExportPDF }: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<"excel" | "pdf" | null>(null)

  const handle = async (type: "excel" | "pdf") => {
    setLoading(type)
    setOpen(false)
    await new Promise(r => setTimeout(r, 300))
    if (type === "excel") onExportExcel()
    else onExportPDF()
    setLoading(null)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 border border-teal-500/20 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-10 z-20 w-44 bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl shadow-lg overflow-hidden">
            <button
              onClick={() => handle("excel")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-foreground hover:bg-[#F8FAFC] dark:hover:bg-muted transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              Export as Excel
            </button>
            <div className="h-px bg-[#E2E8F0] dark:bg-border" />
            <button
              onClick={() => handle("pdf")}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-foreground hover:bg-[#F8FAFC] dark:hover:bg-muted transition-colors"
            >
              <FileText className="w-4 h-4 text-red-500" />
              Export as PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}