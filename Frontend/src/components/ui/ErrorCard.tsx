import { AlertCircle } from "lucide-react"
import { Button } from "./button"

interface ErrorCardProps {
  message?: string
  title?: string
  onRetry?: () => void
}

export function ErrorCard({
  message = "Something went wrong. Please try again.",
  title = "Error",
  onRetry
}: ErrorCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-red-500/10 p-3 mb-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  )
}