import { format, formatDistanceToNow } from "date-fns"

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy")
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy, HH:mm")
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatPhoneNumber(phone: string): string {
  if (phone.startsWith('+91')) {
    const digits = phone.slice(3)
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  return phone
}

export const statusColors = {
  PENDING: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  APPROVED: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  COMPLETED: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  CREATED: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  ORDERED: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  RECEIVED: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" }
}

export function stockLevelColor(quantity: number, minStockLevel: number = 10): string {
  if (quantity <= 0) return "bg-red-500/10 text-red-400 border-red-500/30"
  if (quantity <= minStockLevel) return "bg-amber-500/10 text-amber-400 border-amber-500/30"
  return "bg-green-500/10 text-green-400 border-green-500/30"
}