import { useState } from "react"
import {
  User, Mail, Shield, Building, Key,
  Eye, EyeOff, CheckCircle, Clock,
  ClipboardList, Bell
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface ProfileCardProps {
  requestCount?: number
  pendingCount?: number
  notificationCount?: number
}

export default function ProfileCard({
  requestCount = 0,
  pendingCount = 0,
  notificationCount = 0,
}: ProfileCardProps) {
  const { user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const initials = user?.name
    ?.split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  const roleColors: Record<string, string> = {
    admin: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    receiver: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    procurement: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  }

  const roleColor = roleColors[user?.role || "receiver"]

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    if (!currentPassword) {
      setPasswordError("Please enter your current password")
      return
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    // API call will go here when backend is ready
    setPasswordSuccess(true)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setPasswordSuccess(false), 3000)
  }

  const stats = [
    { label: "Total Requests", value: requestCount, icon: ClipboardList, color: "text-teal-500", bg: "bg-teal-500/10" },
    { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Notifications", value: notificationCount, icon: Bell, color: "text-blue-500", bg: "bg-blue-500/10" },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-muted-foreground">
          Manage your account details and security
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl overflow-hidden">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-teal-600 to-teal-800" />

        {/* Avatar + info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-full bg-teal-500 border-4 border-white dark:border-card flex items-center justify-center text-white text-2xl font-bold">
              {initials}
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full border ${roleColor} capitalize`}>
              {user?.role}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-foreground">
            {user?.name || "—"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-muted-foreground">
            {user?.email || "—"}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(s => (
          <div
            key={s.label}
            className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-4 text-center"
          >
            <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-foreground">{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Account details */}
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-foreground mb-4">
          Account details
        </h3>
        <div className="space-y-3">
          {[
            { icon: User, label: "Full name", value: user?.name || "—" },
            { icon: Mail, label: "Email address", value: user?.email || "—" },
            { icon: Shield, label: "Role", value: user?.role?.toUpperCase() || "—" },
            { icon: Building, label: "Department", value: user?.department || "Not specified" },
          ].map(f => (
            <div
              key={f.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] dark:bg-muted"
            >
              <f.icon className="w-5 h-5 text-slate-400 dark:text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">{f.label}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-foreground">{f.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-teal-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-foreground">
            Change password
          </h3>
        </div>

        {passwordSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-500 text-sm mb-4">
            <CheckCircle className="w-4 h-4" />
            Password updated successfully
          </div>
        )}

        {passwordError && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-4">
            {passwordError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Current password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-muted-foreground">
              Current password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#F8FAFC] dark:bg-muted border border-[#E2E8F0] dark:border-border rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-foreground outline-none focus:border-teal-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-muted-foreground">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full bg-[#F8FAFC] dark:bg-muted border border-[#E2E8F0] dark:border-border rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-foreground outline-none focus:border-teal-500"
            />
            {/* Password strength */}
            {newPassword && (
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      background: newPassword.length >= i * 3
                        ? i <= 1 ? "#F85149"
                          : i <= 2 ? "#E3B341"
                            : i <= 3 ? "#1D9E75"
                              : "#1D9E75"
                        : "#30363D"
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 dark:text-muted-foreground">
              Confirm new password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-[#F8FAFC] dark:bg-muted border border-[#E2E8F0] dark:border-border rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-foreground outline-none focus:border-teal-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirm
                  ? <EyeOff className="w-4 h-4" />
                  : <Eye className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Update password
          </button>
        </form>
      </div>
    </div>
  )
}