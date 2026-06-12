import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { requestService } from "@/services/requestService"

const schema = z.object({
  material: z.string().min(1, "Material name is required"),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, "Quantity must be at least 1")),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function CreateRequestPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null)
  const { toast } = useToast()
  const form = useForm<FormValues>({ resolver: zodResolver(schema) as any, defaultValues: { material: "", quantity: 1, location: "", description: "" } })

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      await requestService.create({ material: data.material, quantity: data.quantity, location: data.location, description: data.description })
      setSubmittedData(data)
      setSubmitted(true)
      toast({ title: "Request Submitted", description: `${data.material} (Qty: ${data.quantity}) has been recorded.` })
    } catch (err: any) {
      console.error("Submit failed", err)
      const errorMsg = err.response?.data || "Could not submit request. Please try again."
      toast({ title: "Submission Failed", description: typeof errorMsg === 'string' ? errorMsg : "Check your input data.", variant: "destructive" })
    } finally { setLoading(false) }
  }

  if (submitted && submittedData) {
    return (
      <div className="flex justify-center pt-12">
        <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-teal-500" /></div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-foreground">Request Submitted</h3>
          <p className="text-slate-500 dark:text-muted-foreground">Your request for <strong>{submittedData.material}</strong> (Qty: {submittedData.quantity}) has been recorded.</p>
          <Button onClick={() => { setSubmitted(false); form.reset() }} className="bg-teal-600 hover:bg-teal-700 text-white">Create Another Request</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6"><h1 className="text-2xl font-bold text-slate-900 dark:text-foreground">Create Material Request</h1><p className="text-slate-500 dark:text-muted-foreground">Fill in the details below to raise a new request</p></div>
      <div className="bg-white dark:bg-card border border-[#E2E8F0] dark:border-border rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="material" render={({ field }) => (<FormItem><FormLabel>Material Name *</FormLabel><FormControl><Input placeholder="e.g. CCTV Camera, Cable Wire" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="quantity" render={({ field }) => (<FormItem><FormLabel>Quantity *</FormLabel><FormControl><Input type="number" min={1} placeholder="e.g. 10" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="location" render={({ field }) => (<FormItem><FormLabel>Target Location *</FormLabel><FormControl><Input placeholder="e.g. Site A, Warehouse B" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Reason / Notes</FormLabel><FormControl><Textarea placeholder="Optional: why is this material needed?" rows={3} {...field} /></FormControl></FormItem>)} />
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white" disabled={loading}>{loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</> : "Submit Request"}</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
