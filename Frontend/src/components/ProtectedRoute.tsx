import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth, type Role } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
  children: ReactNode
  roles?: Role[]
}

const DASHBOARD_ROUTES: Record<Role, string> = {
  receiver: "/app/receiver/dashboard",
  admin: "/app/admin/dashboard",
  procurement: "/app/procurement/dashboard",
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={DASHBOARD_ROUTES[user.role]} replace />
  }

  return <>{children}</>
}
