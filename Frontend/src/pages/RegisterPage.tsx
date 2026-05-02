import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/authService"

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["RECEIVER", "ADMIN", "PROCUREMENT"], { required_error: "Select a role" }),
  department: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] })

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0)
  const { toast } = useToast()
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { fullName: "", username: "", email: "", department: "", password: "", confirmPassword: "" } })
  const pw = form.watch("password")

  useEffect(() => {
    if (!pw) { setStrength(0); return }
    let s = 0
    if (pw.length >= 8) s += 25; if (/[A-Z]/.test(pw)) s += 25; if (/[0-9]/.test(pw)) s += 25; if (/[^A-Za-z0-9]/.test(pw)) s += 25
    setStrength(s)
  }, [pw])

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      await authService.register({ username: data.username, email: data.email, password: data.password, role: data.role, fullName: data.fullName, department: data.department })
      toast({ title: "Account Created", description: "You can now login." })
    } catch { toast({ title: "Registration Failed", description: "Could not create account.", variant: "destructive" }) }
    finally { setLoading(false) }
  }

  const sColor = strength < 50 ? "bg-red-500" : strength < 75 ? "bg-amber-500" : "bg-teal-500"
  const ic = "bg-slate-800 border-slate-700 text-white focus-visible:ring-teal-500"

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 py-12">
      <Link to="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"><ShieldCheck className="w-8 h-8 text-teal-600" /><span className="text-2xl font-bold tracking-tight text-white">ProcureX</span></Link>
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-8">
        <div className="mb-8 text-center"><h1 className="text-2xl font-bold text-white mb-2">Request System Access</h1><p className="text-slate-400">Create an account to join the procurement network.</p></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="fullName" render={({ field, fieldState }) => (<FormItem><FormLabel className="text-slate-300">Full Name</FormLabel><FormControl><Input placeholder="John Doe" className={`${ic} ${fieldState.error ? "border-red-500" : ""}`} {...field} /></FormControl><FormMessage className="text-red-400 text-xs" /></FormItem>)} />
              <FormField control={form.control} name="username" render={({ field, fieldState }) => (<FormItem><FormLabel className="text-slate-300">Username</FormLabel><FormControl><Input placeholder="jdoe" className={`${ic} ${fieldState.error ? "border-red-500" : ""}`} {...field} /></FormControl><FormMessage className="text-red-400 text-xs" /></FormItem>)} />
            </div>
            <FormField control={form.control} name="email" render={({ field, fieldState }) => (<FormItem><FormLabel className="text-slate-300">Email</FormLabel><FormControl><Input placeholder="john@company.com" className={`${ic} ${fieldState.error ? "border-red-500" : ""}`} {...field} /></FormControl><FormMessage className="text-red-400 text-xs" /></FormItem>)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="role" render={({ field, fieldState }) => (<FormItem><FormLabel className="text-slate-300">System Role</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className={`${ic} ${fieldState.error ? "border-red-500" : ""}`}><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl><SelectContent className="bg-slate-800 border-slate-700 text-white"><SelectItem value="RECEIVER">Receiver</SelectItem><SelectItem value="ADMIN">Admin</SelectItem><SelectItem value="PROCUREMENT">Procurement</SelectItem></SelectContent></Select><FormMessage className="text-red-400 text-xs" /></FormItem>)} />
              <FormField control={form.control} name="department" render={({ field }) => (<FormItem><FormLabel className="text-slate-300">Department <span className="text-slate-500 text-xs">(Optional)</span></FormLabel><FormControl><Input placeholder="Security Ops" className={ic} {...field} /></FormControl></FormItem>)} />
            </div>
            <FormField control={form.control} name="password" render={({ field, fieldState }) => (<FormItem><FormLabel className="text-slate-300">Password</FormLabel><FormControl><div className="relative"><Input type={showPw ? "text" : "password"} placeholder="••••••••" className={`${ic} pr-10 ${fieldState.error ? "border-red-500" : ""}`} {...field} /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></FormControl>{pw && <div className="mt-2 flex gap-1 h-1">{[25,50,75,100].map(t=><div key={t} className={`h-full flex-1 rounded-full ${strength >= t ? sColor : "bg-slate-700"}`} />)}</div>}<FormMessage className="text-red-400 text-xs" /></FormItem>)} />
            <FormField control={form.control} name="confirmPassword" render={({ field, fieldState }) => (<FormItem><FormLabel className="text-slate-300">Confirm Password</FormLabel><FormControl><div className="relative"><Input type={showCpw ? "text" : "password"} placeholder="••••••••" className={`${ic} pr-10 ${fieldState.error ? "border-red-500" : ""}`} {...field} /><button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">{showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></FormControl><FormMessage className="text-red-400 text-xs" /></FormItem>)} />
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-lg rounded-lg mt-6" disabled={loading}>{loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" />Processing...</> : "Create Account"}</Button>
          </form>
        </Form>
        <div className="mt-8 text-center text-sm text-slate-400">Already have an account?{" "}<Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">Log in</Link></div>
      </div>
    </div>
  )
}
