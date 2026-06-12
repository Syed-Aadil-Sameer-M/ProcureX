import { useState, useEffect } from "react"
import { Users as UsersIcon, Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { userService, type User } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DataTable, type Column } from "@/components/shared/DataTable"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const userSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().optional().refine((val) => !val || val.length >= 8, "Password must be at least 8 characters"),
  role: z.enum(["RECEIVER", "ADMIN", "PROCUREMENT"]),
  department: z.string().min(1, "Department is required"),
  phoneNumber: z.string().optional()
})

type UserFormValues = z.infer<typeof userSchema>

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null)
  const { toast } = useToast()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { fullName: "", username: "", email: "", password: "", role: "RECEIVER", department: "", phoneNumber: "" }
  })

  const fetchUsers = () => {
    setLoading(true)
    userService.getAll()
      .then(setUsers)
      .catch(() => toast({ title: "Error", description: "Failed to load users", variant: "destructive" }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user)
      form.reset({
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role as any,
        department: user.department,
        phoneNumber: user.phoneNumber || "",
        password: ""
      })
    } else {
      setEditingUser(null)
      form.reset({ fullName: "", username: "", email: "", password: "", role: "RECEIVER", department: "", phoneNumber: "" })
    }
    setIsModalOpen(true)
  }

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id!, data as User)
        toast({ title: "Success", description: "User updated successfully" })
      } else {
        if (!data.password) {
          form.setError("password", { message: "Password is required for new users" });
          return;
        }
        await userService.create(data as User)
        toast({ title: "Success", description: "User created successfully" })
      }
      setIsModalOpen(false)
      fetchUsers()
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to save user", variant: "destructive" })
    }
  }

  const handleDelete = async () => {
    if (!deletingUserId) return
    try {
      await userService.delete(deletingUserId)
      toast({ title: "Success", description: "User deleted successfully" })
      fetchUsers()
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" })
    } finally {
      setDeletingUserId(null)
    }
  }

  const columns: Column<User>[] = [
    { header: "Name", accessor: "fullName" },
    { header: "Username", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Department", accessor: "department" },
    { header: "Status", render: () => <span className="text-green-500 font-medium">Active</span> },
    {
      header: "Actions",
      render: (u) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => openModal(u)}><Edit className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => setDeletingUserId(u.id!)}><Trash2 className="w-4 h-4" /></Button>
        </div>
      )
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between"><Skeleton className="h-10 w-48" /><Skeleton className="h-10 w-24" /></div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and roles</p>
        </div>
        <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" /> Add User</Button>
      </div>

      <DataTable columns={columns} data={users} />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="username" render={({ field }) => (<FormItem><FormLabel>Username *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password {editingUser ? "(Leave blank to keep)" : "*"}</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RECEIVER">Receiver</SelectItem>
                      <SelectItem value="PROCUREMENT">Procurement</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel>Department *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="flex justify-end pt-4"><Button type="submit">Save User</Button></div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingUserId} onOpenChange={() => setDeletingUserId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeletingUserId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
