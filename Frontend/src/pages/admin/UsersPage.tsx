import { Users as UsersIcon } from "lucide-react"

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@procurex.com", role: "RECEIVER", status: "Active" },
  { id: "2", name: "Jane Smith", email: "jane@procurex.com", role: "ADMIN", status: "Active" },
  { id: "3", name: "Bob Builder", email: "bob@procurex.com", role: "PROCUREMENT", status: "Active" },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">User Management</h1><p className="text-muted-foreground">Manage system users and roles</p></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><UsersIcon className="w-4 h-4" />{mockUsers.length} users</div></div>
      <div className="grid gap-4">{mockUsers.map(u => (<div key={u.id} className="bg-card border rounded-xl p-5 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">{u.name.charAt(0)}</div><div><p className="font-medium">{u.name}</p><p className="text-sm text-muted-foreground">{u.email}</p></div></div><div className="flex items-center gap-3"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-500">{u.role}</span><span className="w-2 h-2 rounded-full bg-green-500" /></div></div>))}</div>
    </div>
  )
}
