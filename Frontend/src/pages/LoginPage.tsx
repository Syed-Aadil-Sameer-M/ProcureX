import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/contexts/AuthContext"
import { authService } from "@/services/authService"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

const DASHBOARD_ROUTES: Record<string, string> = {
  receiver: "/app/receiver/dashboard",
  admin: "/app/admin/dashboard",
  procurement: "/app/procurement/dashboard",
  RECEIVER: "/app/receiver/dashboard",
  ADMIN: "/app/admin/dashboard",
  PROCUREMENT: "/app/procurement/dashboard",
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      })

      // Normalize role to lowercase to match frontend Role type
      const normalizedRole = response.role.toLowerCase() as Role

      login(response.token, {
        id: "0",
        name: response.username,
        email: data.email,
        role: normalizedRole,
      })

      toast({
        title: "Welcome back!",
        description: `Logged in as ${response.username}`,
      })

      navigate(DASHBOARD_ROUTES[normalizedRole] || "/app/receiver/dashboard")
    } catch (error: unknown) {
      console.error("Login failed", error)
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please check your email and password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
        <ShieldCheck className="w-10 h-10 text-teal-400" />
        <span className="text-3xl font-bold tracking-tight text-white">ProcureX</span>
      </Link>

      <div className="w-full max-w-md bg-[#1E293B] border border-white/10 rounded-xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Command Center Login</h1>
          <p className="text-slate-400">Enter your credentials to access the system.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@procurex.com"
                      data-testid="input-email"
                      className={`bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-teal-500 ${
                        fieldState.error ? "border-red-500 focus-visible:ring-red-500" : ""
                      } ${!fieldState.invalid && field.value ? "border-teal-500/50" : ""}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        data-testid="input-password"
                        className={`bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-600 focus-visible:ring-teal-500 pr-10 ${
                          fieldState.error ? "border-red-500 focus-visible:ring-red-500" : ""
                        } ${!fieldState.invalid && field.value ? "border-teal-500/50" : ""}`}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-slate-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none text-slate-300 cursor-pointer">Remember me</FormLabel>
                  </FormItem>
                )}
              />
              <Link to="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              data-testid="button-login"
              className="w-full bg-[#0D9488] hover:bg-[#0B7D73] text-white h-11 text-base rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
            Create Account
          </Link>
        </div>
      </div>

      <div className="mt-6 text-xs text-slate-600">
        <Link to="/" className="hover:text-slate-400 transition-colors">
          &larr; Return to Homepage
        </Link>
      </div>
    </div>
  )
}
