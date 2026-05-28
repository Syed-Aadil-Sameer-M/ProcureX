import { useState } from "react"
import { Menu, Search, Bell, Settings, LogOut, User as UserIcon } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NotificationsDrawer from "@/components/shared/NotificationsDrawer"
import { useNotifications } from "@/hooks/useNotifications"

interface NavbarProps {
  toggleSidebar: () => void
}

export function Navbar({ toggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const {
    notifications, unreadCount,
    markAsRead, markAllAsRead, clearAll
  } = useNotifications()

  return (
    <>
      <header
        className="h-[56px] shrink-0 bg-white dark:bg-card border-b border-[#E2E8F0] dark:border-border flex items-center justify-between px-4 z-50 sticky top-0"
        data-testid="navbar"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-slate-100 dark:hover:bg-muted rounded-md text-slate-600 dark:text-muted-foreground"
            data-testid="button-toggle-sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-foreground tracking-tight hidden sm:block">
              ProcureX
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] dark:bg-muted border border-[#E2E8F0] dark:border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-900 dark:text-foreground placeholder:text-slate-500"
              data-testid="input-global-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Bell with badge */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative p-2 text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted rounded-full transition-colors"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" data-testid="dropdown-profile">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-red-600 focus:text-red-600"
                data-testid="menu-item-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Notifications drawer */}
      <NotificationsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearAll}
      />
    </>
  )
}