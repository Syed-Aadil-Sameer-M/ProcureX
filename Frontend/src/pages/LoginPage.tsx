import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShieldCheck, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"

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
    <>
      {/* ── Animated background ── */}
      <style>{`
        @keyframes meshMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-18px) rotate(1deg); }
          66%       { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(20,184,166,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(20,184,166,0); }
          100% { box-shadow: 0 0 0 0 rgba(20,184,166,0); }
        }
        @keyframes orb1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(40px,-30px) scale(1.1); }
        }
        @keyframes orb2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-30px,40px) scale(0.9); }
        }
        .login-bg {
          background: linear-gradient(135deg, #020617 0%, #0a1628 30%, #0d2137 60%, #091525 100%);
          background-size: 400% 400%;
          animation: meshMove 12s ease infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 32px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .float-card {
          animation: float 7s ease-in-out infinite;
        }
        .fade-up-1 { animation: fadeUp 0.6s ease both 0.1s; opacity: 0; }
        .fade-up-2 { animation: fadeUp 0.6s ease both 0.2s; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.6s ease both 0.3s; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.6s ease both 0.4s; opacity: 0; }
        .fade-up-5 { animation: fadeUp 0.6s ease both 0.5s; opacity: 0; }
        .fade-up-6 { animation: fadeUp 0.6s ease both 0.6s; opacity: 0; }
        .glow-input:focus-within {
          box-shadow: 0 0 0 2px rgba(20,184,166,0.5);
          border-color: rgba(20,184,166,0.8) !important;
          transition: all 0.2s ease;
        }
        .login-btn {
          background: linear-gradient(135deg, #0d9488, #0891b2);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }
        .login-btn:hover::before { left: 100%; }
        .login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(13,148,136,0.4);
        }
        .login-btn:active { transform: translateY(0); }
        .orb1 { animation: orb1 8s ease-in-out infinite; }
        .orb2 { animation: orb2 10s ease-in-out infinite; }
      `}</style>

      <div className="login-bg min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">

        {/* Ambient orbs */}
        <div className="orb1 absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)" }} />
        <div className="orb2 absolute bottom-[-80px] right-[-80px] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 60%)" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }} />

        {/* Logo */}
        <div className="fade-up-1 mb-8 float-card">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="relative">
              <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center border border-teal-500/30 group-hover:border-teal-400/50 transition-colors"
                style={{ boxShadow: "0 0 20px rgba(20,184,166,0.2)" }}>
                <ShieldCheck className="w-7 h-7 text-teal-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full"
                style={{ animation: "pulse-ring 2s infinite" }} />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white">ProcureX</span>
              <p className="text-[10px] text-teal-400/70 tracking-widest uppercase">Surveillance Procurement</p>
            </div>
          </Link>
        </div>

        {/* Glass card */}
        <div className="glass-card w-full max-w-md rounded-2xl p-8">

          {/* Card header */}
          <div className="fade-up-2 text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-4">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs text-teal-400 font-medium tracking-wide">SECURE ACCESS</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1.5">Command Center Login</h1>
            <p className="text-slate-400 text-sm">Enter your credentials to access the system</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              {/* Email field */}
              <div className="fade-up-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm font-medium">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className={`glow-input relative rounded-lg border transition-all duration-200 ${
                          fieldState.error
                            ? "border-red-500/60"
                            : field.value
                              ? "border-teal-500/40"
                              : "border-white/10"
                        }`}>
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <Input
                            placeholder="you@procurex.com"
                            data-testid="input-email"
                            className="bg-transparent border-0 text-white placeholder:text-slate-600 focus-visible:ring-0 pl-10 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password field */}
              <div className="fade-up-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className={`glow-input relative rounded-lg border transition-all duration-200 ${
                          fieldState.error
                            ? "border-red-500/60"
                            : field.value
                              ? "border-teal-500/40"
                              : "border-white/10"
                        }`}>
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            data-testid="input-password"
                            className="bg-transparent border-0 text-white placeholder:text-slate-600 focus-visible:ring-0 pl-10 pr-10 h-11"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {showPassword
                              ? <EyeOff className="w-4 h-4" />
                              : <Eye className="w-4 h-4" />
                            }
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Remember me + forgot */}
              <div className="fade-up-5 flex items-center justify-between">
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
                      <FormLabel className="text-sm font-medium leading-none text-slate-400 cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Link
                  to="/forgot-password"
                  className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit button */}
              <div className="fade-up-6">
                <Button
                  type="submit"
                  data-testid="button-login"
                  className="login-btn w-full text-white h-11 text-base rounded-xl font-semibold border-0"
                  disabled={isLoading}
                >
                  {isLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Authenticating...</>
                    : "Sign In to ProcureX"
                  }
                </Button>
              </div>

            </form>
          </Form>

          {/* Divider */}
          <div className="fade-up-6 flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register link */}
          <div className="fade-up-6 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              Create Account →
            </Link>
          </div>
        </div>

        {/* Security badges */}
        <div className="fade-up-6 mt-6 flex items-center gap-4">
          {["256-bit SSL", "SOC 2 Compliant", "Zero Trust"].map(badge => (
            <div
              key={badge}
              className="flex items-center gap-1.5 text-[10px] text-slate-600"
            >
              <div className="w-1.5 h-1.5 bg-teal-500/50 rounded-full" />
              {badge}
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="fade-up-6 mt-3 text-xs text-slate-600">
          <Link to="/" className="hover:text-slate-400 transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </>
  )
}