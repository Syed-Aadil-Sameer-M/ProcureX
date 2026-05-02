import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import type { LucideIcon } from "lucide-react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Bell,
  User,
} from "lucide-react"

export interface NavLink {
  icon: LucideIcon
  label: string
  href: string
}

interface AuthLayoutProps {
  children: ReactNode
  links?: NavLink[]
}

const defaultReceiverLinks: NavLink[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app/receiver/dashboard" },
  { icon: PlusCircle, label: "Create Request", href: "/app/receiver/create" },
  { icon: ClipboardList, label: "My Requests", href: "/app/receiver/requests" },
  { icon: Bell, label: "Notifications", href: "/app/receiver/notifications" },
  { icon: User, label: "Profile", href: "/app/receiver/profile" },
]

export function AuthLayout({ children, links }: AuthLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("procurex_sidebar_collapsed") === "true"
  })

  useEffect(() => {
    localStorage.setItem("procurex_sidebar_collapsed", String(collapsed))
  }, [collapsed])

  const toggleSidebar = () => setCollapsed(!collapsed)
  const navLinks = links ?? defaultReceiverLinks

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-background text-slate-900 dark:text-foreground font-sans" data-testid="auth-layout">
      <Sidebar collapsed={collapsed} links={navLinks} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
