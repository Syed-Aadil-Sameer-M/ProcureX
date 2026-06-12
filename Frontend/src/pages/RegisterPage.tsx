import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ShieldCheck, Eye, EyeOff, Loader2,
  User, Mail, Building, Phone,
  Shield, Package, ClipboardList,
  ArrowRight, ArrowLeft, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/services/authService"

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  role: z.enum(["RECEIVER", "ADMIN", "PROCUREMENT"]),
  department: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

type FormValues = z.infer<typeof schema>

const ROLES = [
  {
    value: "RECEIVER",
    label: "Receiver",
    desc: "Create and track material requests",
    icon: ClipboardList,
    color: "teal",
  },
  {
    value: "ADMIN",
    label: "Admin",
    desc: "Approve requests and manage system",
    icon: Shield,
    color: "purple",
  },
  {
    value: "PROCUREMENT",
    label: "Procurement",
    desc: "Manage inventory and purchase orders",
    icon: Package,
    color: "amber",
  },
]

const roleStyles: Record<string, { border: string; bg: string; icon: string; badge: string }> = {
  teal: {
    border: "border-teal-500",
    bg: "bg-teal-500/10",
    icon: "text-teal-400",
    badge: "bg-teal-500/20 text-teal-400",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-500/10",
    icon: "text-purple-400",
    badge: "bg-purple-500/20 text-purple-400",
  },
  amber: {
    border: "border-amber-500",
    bg: "bg-amber-500/10",
    icon: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-400",
  },
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [showPw, setShowPw] = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "", username: "", email: "",
      phone: "", department: "", password: "", confirmPassword: ""
    },
  })

  const pw = form.watch("password")

  useEffect(() => {
    if (!pw) { setStrength(0); return }
    let s = 0
    if (pw.length >= 8) s += 25
    if (/[A-Z]/.test(pw)) s += 25
    if (/[0-9]/.test(pw)) s += 25
    if (/[^A-Za-z0-9]/.test(pw)) s += 25
    setStrength(s)
  }, [pw])

  const strengthLabel = strength === 0 ? "" : strength <= 25 ? "Weak" : strength <= 50 ? "Fair" : strength <= 75 ? "Good" : "Strong"
  const strengthColor = strength <= 25 ? "#F85149" : strength <= 50 ? "#E3B341" : strength <= 75 ? "#1D9E75" : "#22c55e"

  const handleNext = async () => {
    const valid = await form.trigger(["fullName", "username", "email", "phone"])
    if (!selectedRole) {
      toast({ title: "Select a role", description: "Please choose your system role to continue.", variant: "destructive" })
      return
    }
    if (valid) {
      form.setValue("role", selectedRole as "RECEIVER" | "ADMIN" | "PROCUREMENT")
      setStep(2)
    }
  }

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      await authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        fullName: data.fullName,
        department: data.department,
      })
      toast({ title: "Account Created", description: "You can now login." })
    } catch {
      toast({ title: "Registration Failed", description: "Could not create account.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes meshMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideBack {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .reg-bg {
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
        .fade-up { animation: fadeUp 0.5s ease both; }
        .slide-in { animation: slideIn 0.4s ease both; }
        .slide-back { animation: slideBack 0.4s ease both; }
        .reg-input {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          color: white !important;
          transition: all 0.2s ease;
        }
        .reg-input:focus {
          border-color: rgba(20,184,166,0.6) !important;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.15) !important;
          outline: none !important;
        }
        .reg-input::placeholder { color: rgba(148,163,184,0.5) !important; }
        .role-card {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .role-card:hover { background: rgba(255,255,255,0.06); transform: translateY(-1px); }
        .next-btn {
          background: linear-gradient(135deg, #0d9488, #0891b2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .next-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }
        .next-btn:hover::before { left: 100%; }
        .next-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(13,148,136,0.4); }
      `}</style>

      <div className="reg-bg min-h-screen flex flex-col justify-center items-center p-4 py-10 relative overflow-hidden">

        {/* Orbs */}
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }} />

        {/* Logo */}
        <div className="fade-up mb-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center border border-teal-500/30"
              style={{ boxShadow: "0 0 20px rgba(20,184,166,0.2)" }}>
              <ShieldCheck className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">ProcureX</span>
              <p className="text-[10px] text-teal-400/70 tracking-widest uppercase">Surveillance Procurement</p>
            </div>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="fade-up flex items-center gap-3 mb-6">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > s
                  ? "bg-teal-500 text-white"
                  : step === s
                    ? "bg-teal-500/20 border-2 border-teal-500 text-teal-400"
                    : "bg-white/5 border border-white/10 text-slate-600"
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-xs font-medium ${step === s ? "text-white" : "text-slate-600"}`}>
                {s === 1 ? "Personal Info" : "Credentials"}
              </span>
              {s < 2 && <div className={`w-12 h-px mx-1 ${step > 1 ? "bg-teal-500" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Glass card */}
        <div className="glass-card w-full max-w-lg rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              {step === 1 ? "Request System Access" : "Set Your Credentials"}
            </h1>
            <p className="text-slate-400 text-sm">
              {step === 1 ? "Tell us about yourself and your role" : "Secure your account with a strong password"}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

              {/* ── STEP 1 ── */}
              {step === 1 && (
                <div className="slide-back space-y-4">
                  {/* Full name + username */}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="fullName" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-slate-400 text-xs font-medium uppercase tracking-wide">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <input
                              placeholder="John Doe"
                              className={`reg-input w-full pl-9 pr-3 py-2.5 rounded-lg text-sm ${fieldState.error ? "border-red-500/60 !border-red-500/60" : ""}`}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="username" render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-slate-400 text-xs font-medium uppercase tracking-wide">Username</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">@</span>
                            <input
                              placeholder="jdoe"
                              className={`reg-input w-full pl-7 pr-3 py-2.5 rounded-lg text-sm ${fieldState.error ? "!border-red-500/60" : ""}`}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )} />
                  </div>

                  {/* Email */}
                  <FormField control={form.control} name="email" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-xs font-medium uppercase tracking-wide">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                          <input
                            type="email"
                            placeholder="john@company.com"
                            className={`reg-input w-full pl-9 pr-3 py-2.5 rounded-lg text-sm ${fieldState.error ? "!border-red-500/60" : ""}`}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                  {/* Phone + Department */}
                  <div className="grid grid-cols-1 gap-3">
  <FormField control={form.control} name="phone" render={({ field }) => (
    <FormItem>
      <FormLabel className="text-slate-400 text-xs font-medium uppercase tracking-wide">Phone <span className="text-slate-600 normal-case">(optional)</span></FormLabel>
      <FormControl>
        <div className="flex">
          <div className="reg-input flex items-center px-3 text-xs text-slate-400 whitespace-nowrap"
            style={{ borderRadius: "8px 0 0 8px", borderRight: "none" }}>
            <Phone className="w-3 h-3 mr-1" />+91
          </div>
          <input
            type="tel"
            placeholder="9876543210"
            className="reg-input flex-1 px-3 py-2.5 text-sm"
            style={{ borderRadius: "0 8px 8px 0", borderLeft: "none" }}
            {...field}
          />
        </div>
      </FormControl>
    </FormItem>
  )} />

  <FormField control={form.control} name="department" render={({ field }) => (
    <FormItem>
      <FormLabel className="text-slate-400 text-xs font-medium uppercase tracking-wide">
        Department <span className="text-slate-600 normal-case">(optional)</span>
      </FormLabel>
      <FormControl>
        <div className="relative">
          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            placeholder="e.g. Security Ops, IT Team, Warehouse"
            className="reg-input w-full pl-9 pr-3 py-2.5 rounded-lg text-sm"
            {...field}
          />
        </div>
      </FormControl>
    </FormItem>
  )} />
</div>

                  {/* Role cards */}
                  <div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-2">Select Your Role *</p>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLES.map(r => {
                        const isSelected = selectedRole === r.value
                        const s = roleStyles[r.color]
                        return (
                          <div
                            key={r.value}
                            onClick={() => setSelectedRole(r.value)}
                            className={`role-card rounded-xl p-3 text-center ${isSelected ? `${s.border} ${s.bg}` : ""}`}
                          >
                            <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${isSelected ? s.bg : "bg-white/5"}`}>
                              <r.icon className={`w-4 h-4 ${isSelected ? s.icon : "text-slate-500"}`} />
                            </div>
                            <p className={`text-xs font-semibold mb-0.5 ${isSelected ? "text-white" : "text-slate-400"}`}>
                              {r.label}
                            </p>
                            <p className="text-[10px] text-slate-600 leading-tight">{r.desc}</p>
                            {isSelected && (
                              <span className={`inline-block mt-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${s.badge}`}>
                                Selected ✓
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Next button */}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="next-btn w-full text-white h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-2"
                  >
                    Continue to Credentials
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* ── STEP 2 ── */}
              {step === 2 && (
                <div className="slide-in space-y-4">

                  {/* Selected role summary */}
                  {selectedRole && (() => {
                    const r = ROLES.find(x => x.value === selectedRole)!
                    const s = roleStyles[r.color]
                    return (
                      <div className={`flex items-center gap-3 p-3 rounded-xl border ${s.border} ${s.bg}`}>
                        <r.icon className={`w-5 h-5 ${s.icon}`} />
                        <div>
                          <p className="text-xs text-slate-400">Registering as</p>
                          <p className="text-sm font-semibold text-white">{r.label}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    )
                  })()}

                  {/* Password */}
                  <FormField control={form.control} name="password" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-xs font-medium uppercase tracking-wide">Password</FormLabel>
                      <FormControl>
                        <div className={`relative rounded-lg border transition-all duration-200 ${fieldState.error ? "border-red-500/60" : "border-white/10"}`}
                          style={{ background: "rgba(255,255,255,0.05)" }}>
                          <input
                            type={showPw ? "text" : "password"}
                            placeholder="Min. 8 characters"
                            className="w-full bg-transparent pl-4 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none"
                            {...field}
                          />
                          <button type="button" onClick={() => setShowPw(!showPw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>

                      {/* Strength meter */}
                      {pw && (
                        <div className="mt-2 space-y-1">
                          <div className="flex gap-1 h-1">
                            {[25, 50, 75, 100].map(t => (
                              <div key={t} className="flex-1 rounded-full transition-all duration-300"
                                style={{ background: strength >= t ? strengthColor : "rgba(255,255,255,0.08)" }} />
                            ))}
                          </div>
                          <p className="text-[11px]" style={{ color: strengthColor }}>
                            {strengthLabel} password
                          </p>
                        </div>
                      )}
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                  {/* Confirm password */}
                  <FormField control={form.control} name="confirmPassword" render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-xs font-medium uppercase tracking-wide">Confirm Password</FormLabel>
                      <FormControl>
                        <div className={`relative rounded-lg border transition-all duration-200 ${fieldState.error ? "border-red-500/60" : "border-white/10"}`}
                          style={{ background: "rgba(255,255,255,0.05)" }}>
                          <input
                            type={showCpw ? "text" : "password"}
                            placeholder="Re-enter password"
                            className="w-full bg-transparent pl-4 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none"
                            {...field}
                          />
                          <button type="button" onClick={() => setShowCpw(!showCpw)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                            {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )} />

                  {/* Password tips */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "8+ characters", met: pw.length >= 8 },
                      { label: "Uppercase letter", met: /[A-Z]/.test(pw) },
                      { label: "Number", met: /[0-9]/.test(pw) },
                      { label: "Special character", met: /[^A-Za-z0-9]/.test(pw) },
                    ].map(tip => (
                      <div key={tip.label} className={`flex items-center gap-1.5 text-xs ${tip.met ? "text-teal-400" : "text-slate-600"}`}>
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${tip.met ? "bg-teal-500/20" : "bg-white/5"}`}>
                          {tip.met && <Check className="w-2 h-2" />}
                        </div>
                        {tip.label}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <Button
                      type="submit"
                      className="next-btn flex-1 text-white h-11 rounded-xl font-semibold text-sm border-0"
                      disabled={loading}
                    >
                      {loading
                        ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating account...</>
                        : "Create Account →"
                      }
                    </Button>
                  </div>
                </div>
              )}

            </form>
          </Form>

          <div className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              Sign in →
            </Link>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-600">
          <Link to="/" className="hover:text-slate-400 transition-colors">← Return to Homepage</Link>
        </div>
      </div>
    </>
  )
}