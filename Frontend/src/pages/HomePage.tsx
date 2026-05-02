import { Link } from "react-router-dom"
import { ShieldCheck, Activity, FileCheck, Package, ShoppingCart, History, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  { icon: Activity, title: "Request Tracking", desc: "End-to-end visibility of every equipment request." },
  { icon: FileCheck, title: "Approval Workflow", desc: "Multi-tier authorization with digital signatures." },
  { icon: Package, title: "Inventory Control", desc: "Real-time stock levels of critical hardware." },
  { icon: ShoppingCart, title: "Procurement", desc: "Direct vendor integration and PO generation." },
  { icon: History, title: "Audit Logs", desc: "Immutable compliance tracking for every action." },
  { icon: BellRing, title: "Notifications", desc: "Instant alerts on critical status changes." },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2"><ShieldCheck className="w-8 h-8 text-teal-600" /><span className="text-xl font-bold tracking-tight text-white">ProcureX</span></Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login"><Button variant="outline" className="border-white/10 text-white hover:bg-white/5">Login</Button></Link>
            <Link to="/register"><Button className="bg-teal-600 hover:bg-teal-700 text-white border-none">Create Account</Button></Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-900/0 to-transparent -z-10" />
          <div className="container mx-auto max-w-5xl text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8">Streamline Your <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">Surveillance Procurement</span></h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">The command center for security professionals. Manage equipment requests, approvals, and inventory in one precise platform.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register"><Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-teal-600 hover:bg-teal-700 text-white text-lg">Start Procuring</Button></Link>
              <Link to="/login"><Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 border-white/10 text-white hover:bg-white/5 text-lg">Login to Dashboard</Button></Link>
            </div>
          </div>
        </section>
        <section id="features" className="py-24 bg-slate-900/50 border-t border-white/5">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16"><h2 className="text-3xl font-bold text-white mb-4">Precision Built Features</h2><p className="text-slate-400 max-w-2xl mx-auto">Everything you need for high-stakes purchasing workflows.</p></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (<div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-white/10 hover:border-teal-500/30 transition-colors"><div className="w-12 h-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4"><f.icon className="w-6 h-6 text-teal-500" /></div><h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3><p className="text-slate-400">{f.desc}</p></div>))}
            </div>
          </div>
        </section>
        <section id="workflow" className="py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16"><h2 className="text-3xl font-bold text-white mb-4">The Procurement Lifecycle</h2></div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
              {[{ step: "01", title: "Receiver Creates Request" }, { step: "02", title: "Admin Approves" }, { step: "03", title: "Procurement Processes" }, { step: "04", title: "Inventory Updated" }].map((p, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center w-full lg:w-1/4"><div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center mb-6 shadow-xl text-xl font-bold text-teal-500">{p.step}</div><h4 className="text-lg font-semibold text-white mb-2">{p.title}</h4></div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-24 bg-slate-900/50 border-y border-white/5">
          <div className="container mx-auto px-4 max-w-6xl"><div className="grid md:grid-cols-3 gap-12">
            {[{ val: "99.9%", label: "Uptime SLA" }, { val: "3x", label: "Faster Approvals" }, { val: "Zero", label: "Lost Requests" }].map((s, i) => (<div key={i} className="text-center md:text-left"><div className="text-4xl font-bold text-white mb-2">{s.val}</div><h4 className="text-teal-500 font-medium mb-4">{s.label}</h4></div>))}
          </div></div>
        </section>
      </main>
      <footer className="border-t border-white/10 bg-slate-900 pt-16 pb-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-2 mb-8"><ShieldCheck className="w-6 h-6 text-teal-600" /><span className="text-lg font-bold text-white">ProcureX</span></div>
          <div className="border-t border-white/10 pt-8 text-sm text-slate-500"><p>&copy; {new Date().getFullYear()} ProcureX Inc. All rights reserved.</p></div>
        </div>
      </footer>
    </div>
  )
}
