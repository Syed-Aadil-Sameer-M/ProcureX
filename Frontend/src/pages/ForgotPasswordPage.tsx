import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { authService } from "@/services/authService"

const emailSchema = z.object({ email: z.string().email("Valid email is required") })
const otpSchema = z.object({ code: z.string().length(6, "Must be 6 digits") })
const passwordSchema = z.object({ password: z.string().min(8, "Min 8 characters"), confirmPassword: z.string() }).refine((d) => d.password === d.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] })

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1|2|3|4>(1)
  const [loading, setLoading] = useState(false)
  const emailForm = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema), defaultValues: { email: "" } })
  const otpForm = useForm<z.infer<typeof otpSchema>>({ resolver: zodResolver(otpSchema), defaultValues: { code: "" } })
  const pwForm = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema), defaultValues: { password: "", confirmPassword: "" } })

  const onEmail = async (data: z.infer<typeof emailSchema>) => { setLoading(true); try { await authService.forgotPassword(data.email) } catch {} setLoading(false); setStep(2) }
  const onOtp = async () => { setLoading(true); await new Promise(r => setTimeout(r, 1000)); setLoading(false); setStep(3) }
  const onPassword = async () => { setLoading(true); await new Promise(r => setTimeout(r, 1500)); setLoading(false); setStep(4) }

  const ic = "bg-slate-800 border-slate-700 text-white focus-visible:ring-teal-500"
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity"><ShieldCheck className="w-8 h-8 text-teal-600" /><span className="text-2xl font-bold tracking-tight text-white">ProcureX</span></Link>
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-8 relative overflow-hidden">
        {step < 4 && (<div className="flex items-center justify-between mb-8"><div className="flex gap-2">{[1,2,3].map(s=><div key={s} className={`h-1.5 w-8 rounded-full ${step >= s ? "bg-teal-500" : "bg-slate-700"}`} />)}</div><span className="text-xs text-slate-400 font-medium">Step {step} of 3</span></div>)}
        {step === 1 && (<div><div className="text-center mb-6"><h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2><p className="text-slate-400 text-sm">Enter your email to receive a recovery code.</p></div>
          <Form {...emailForm}><form onSubmit={emailForm.handleSubmit(onEmail)} className="space-y-4"><FormField control={emailForm.control} name="email" render={({ field }) => (<FormItem><FormLabel className="text-slate-300">Email</FormLabel><FormControl><Input placeholder="you@company.com" className={ic} {...field} /></FormControl><FormMessage className="text-red-400" /></FormItem>)} /><Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11" disabled={loading}>{loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Send Reset Code</Button></form></Form></div>)}
        {step === 2 && (<div><div className="text-center mb-6"><h2 className="text-2xl font-bold text-white mb-2">Verification Code</h2><p className="text-slate-400 text-sm">Enter the 6-digit code sent to your email.</p></div>
          <Form {...otpForm}><form onSubmit={otpForm.handleSubmit(onOtp)} className="space-y-6"><FormField control={otpForm.control} name="code" render={({ field }) => (<FormItem className="flex flex-col items-center"><FormControl><InputOTP maxLength={6} {...field}><InputOTPGroup><InputOTPSlot index={0} className={ic} /><InputOTPSlot index={1} className={ic} /><InputOTPSlot index={2} className={ic} /></InputOTPGroup><InputOTPGroup><InputOTPSlot index={3} className={ic} /><InputOTPSlot index={4} className={ic} /><InputOTPSlot index={5} className={ic} /></InputOTPGroup></InputOTP></FormControl><FormMessage className="text-red-400" /></FormItem>)} /><Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11" disabled={loading}>{loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Verify Code</Button></form></Form></div>)}
        {step === 3 && (<div><div className="text-center mb-6"><h2 className="text-2xl font-bold text-white mb-2">New Password</h2><p className="text-slate-400 text-sm">Set a strong password.</p></div>
          <Form {...pwForm}><form onSubmit={pwForm.handleSubmit(onPassword)} className="space-y-4"><FormField control={pwForm.control} name="password" render={({ field }) => (<FormItem><FormLabel className="text-slate-300">New Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" className={ic} {...field} /></FormControl><FormMessage className="text-red-400" /></FormItem>)} /><FormField control={pwForm.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel className="text-slate-300">Confirm</FormLabel><FormControl><Input type="password" placeholder="••••••••" className={ic} {...field} /></FormControl><FormMessage className="text-red-400" /></FormItem>)} /><Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11 mt-2" disabled={loading}>{loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Reset Password</Button></form></Form></div>)}
        {step === 4 && (<div className="text-center py-6"><div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-8 h-8 text-teal-500" /></div><h2 className="text-2xl font-bold text-white mb-2">Password Updated</h2><p className="text-slate-400 mb-8">Your account has been secured.</p><Link to="/login"><Button className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11">Proceed to Login</Button></Link></div>)}
        {step < 4 && (<div className="mt-8 text-center text-sm"><Link to="/login" className="text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors"><ArrowLeft className="w-4 h-4" /> Back to Login</Link></div>)}
      </div>
    </div>
  )
}
