import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export interface Column<T> {
  header: string
  accessor?: keyof T
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  isLoading?: boolean
}

export function DataTable<T extends { id?: string | number }>({ columns, data, pageSize = 10, isLoading = false }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const currentData = data.slice(startIndex, startIndex + pageSize)

  if (isLoading) {
    return (
      <div className="w-full border border-[#E2E8F0] dark:border-border rounded-xl overflow-hidden bg-white dark:bg-card">
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-slate-100 dark:bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full border border-[#E2E8F0] dark:border-border rounded-xl overflow-hidden bg-white dark:bg-card shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-muted-foreground uppercase bg-[#F8FAFC] dark:bg-muted border-b border-[#E2E8F0] dark:border-border tracking-wider">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-3 font-semibold">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 dark:text-muted-foreground">No data available.</td>
              </tr>
            ) : (
              currentData.map((item, rowIndex) => (
                <tr
                  key={item.id ?? rowIndex}
                  className={`border-b border-[#E2E8F0] dark:border-border last:border-0 hover:bg-teal-50 dark:hover:bg-muted transition-colors ${
                    rowIndex % 2 === 0 ? "bg-white dark:bg-card" : "bg-[#F8FAFC] dark:bg-muted/50"
                  }`}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-foreground">
                      {col.render ? col.render(item) : col.accessor ? (item[col.accessor] as React.ReactNode) : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#E2E8F0] dark:border-border bg-white dark:bg-card shrink-0">
          <span className="text-sm text-slate-500 dark:text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-1 rounded border border-[#E2E8F0] dark:border-border text-slate-600 dark:text-foreground hover:bg-slate-50 dark:hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-1 rounded border border-[#E2E8F0] dark:border-border text-slate-600 dark:text-foreground hover:bg-slate-50 dark:hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
