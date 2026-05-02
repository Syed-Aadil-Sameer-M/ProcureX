import { cn } from "@/lib/utils"

type StatusType = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CREATED" | "SENT" | "RECEIVED" | "OK" | "LOW" | "CRITICAL"

const statusConfig: Record<StatusType, { bg: string; text: string; label?: string }> = {
  PENDING: { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-800 dark:text-amber-400" },
  APPROVED: { bg: "bg-teal-100 dark:bg-teal-500/20", text: "text-teal-800 dark:text-teal-400" },
  REJECTED: { bg: "bg-red-100 dark:bg-red-500/20", text: "text-red-800 dark:text-red-400" },
  COMPLETED: { bg: "bg-green-100 dark:bg-green-500/20", text: "text-green-800 dark:text-green-400" },
  CREATED: { bg: "bg-blue-100 dark:bg-blue-500/20", text: "text-blue-800 dark:text-blue-400" },
  SENT: { bg: "bg-indigo-100 dark:bg-indigo-500/20", text: "text-indigo-800 dark:text-indigo-400" },
  RECEIVED: { bg: "bg-green-100 dark:bg-green-500/20", text: "text-green-800 dark:text-green-400" },
  OK: { bg: "bg-green-100 dark:bg-green-500/20", text: "text-green-800 dark:text-green-400" },
  LOW: { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-800 dark:text-amber-400" },
  CRITICAL: { bg: "bg-red-100 dark:bg-red-500/20", text: "text-red-800 dark:text-red-400" },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as StatusType] || { bg: "bg-slate-100 dark:bg-slate-500/20", text: "text-slate-800 dark:text-slate-400" }
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", config.bg, config.text, className)}>
      {status}
    </span>
  )
}
