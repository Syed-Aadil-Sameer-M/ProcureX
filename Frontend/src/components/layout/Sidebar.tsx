import type { LucideIcon } from "lucide-react"
import { LogOut } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarLink {
  icon: LucideIcon
  label: string
  href: string
}

interface SidebarProps {
  collapsed: boolean
  links: SidebarLink[]
}

export function Sidebar({ collapsed, links }: SidebarProps) {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <aside
      className={`bg-[#0F172A] border-r border-slate-800 flex flex-col transition-all duration-200 ease-in-out shrink-0 ${
        collapsed ? "w-[64px]" : "w-[256px]"
      }`}
      data-testid="sidebar"
    >
      <div className="h-[56px] flex items-center justify-center border-b border-slate-800 shrink-0" />

      <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname.startsWith(link.href)

          const LinkContent = (
            <Link
              to={link.href}
              className={`flex items-center h-10 px-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#0D9488] text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center" : "gap-3"}`}
              data-testid={`sidebar-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{link.label}</span>}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={link.href} delayDuration={0}>
                <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">
                  {link.label}
                </TooltipContent>
              </Tooltip>
            )
          }

          return <div key={link.href}>{LinkContent}</div>
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 shrink-0">
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button onClick={logout} className="w-full flex items-center justify-center h-10 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors" data-testid="button-sidebar-logout">
                <LogOut className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-slate-800 text-white border-slate-700">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <button onClick={logout} className="w-full flex items-center gap-3 h-10 px-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors" data-testid="button-sidebar-logout">
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium whitespace-nowrap">Logout</span>
          </button>
        )}
      </div>
    </aside>
  )
}
