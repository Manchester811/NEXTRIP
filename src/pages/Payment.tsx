import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CreditCard, LockKeyhole, Smartphone, WalletCards, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getSelectedTrip, saveBooking, saveTransaction } from '@/services/bookingStore'

const methods: { label: string; icon: LucideIcon; hint: string }[] = [
  { label: 'UPI', icon: Smartphone, hint: 'Instant bank payment' },
  { label: 'Card', icon: CreditCard, hint: 'Visa, Mastercard, RuPay' },
  { label: 'Wallet', icon: WalletCards, hint: 'Fast digital wallet' },
]

export default function Payment() {
  const navigate = useNavigate()
  const trip = getSelectedTrip()
  const seats = (() => { try { return JSON.parse(sessionStorage.getItem('nextrip:selected-seats') ?? '[]') as string[] } catch { return [] } })()
  const passengers = (() => { try { const v = JSON.parse(sessionStorage.getItem('nextrip:passengers') ?? '[]') as { name: string; age: number; gender: string }[]; return v } catch { return [] } })()
  const [method, setMethod] = useState('UPI')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const seatFee = seats.length * Math.max(50, Math.round((trip?.price ?? 0) / 6))
  const taxes = Math.round((trip?.price ?? 0) * 0.05)
  const total = useMemo(() => (trip?.price ?? 0) + seatFee + taxes, [trip?.price, seatFee, taxes])

  if (!trip) return <Container className="py-24 text-center"><p>No trip selected.</p></Container>

  const pay = () => {
    if (processing) return
    setPaymentError('')
    setProcessing(true)
    const transactionId = `TXN${Date.now().toString().slice(-10)}`
    saveTransaction({ id: transactionId, bookingId: 'pending', method, amount: total, status: 'processing', createdAt: new Date().toISOString() })
    window.setTimeout(() => {
      const id = `NX${Date.now().toString().slice(-8)}`
      saveBooking({ id, status: 'Upcoming', trip, seats, passengers, total, bookedAt: new Date().toISOString(), transactionId })
      saveTransaction({ id: transactionId, bookingId: id, method, amount: total, status: 'successful', createdAt: new Date().toISOString() })
      sessionStorage.setItem('nextrip:last-booking-id', id)
      setProcessing(false)
      setSuccess(true)
      window.setTimeout(() => navigate(`/confirmation/${id}`), 850)
    }, 1200)
  }

  return <div className="min-h-screen bg-paper-dim pb-20"><Container className="pt-7"><button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-950"><ArrowLeft className="h-4 w-4" /> Back</button><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
    <Card className="overflow-hidden p-6 sm:p-8"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Secure checkout</p><h1 className="mt-2 font-display text-3xl font-semibold">Complete your payment</h1></div><span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal-50 text-signal-700"><LockKeyhole className="h-5 w-5" /></span></div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">{methods.map(({ label, icon: Icon, hint }) => <button key={label} onClick={() => setMethod(label)} className={`group rounded-2xl border p-4 text-left transition-all ${method === label ? 'border-signal-500 bg-signal-50 shadow-sm' : 'border-paper-line bg-white hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-md'}`}><Icon className="h-5 w-5 text-signal-600" /><p className="mt-3 text-sm font-semibold">{label}</p><p className="mt-1 text-xs text-ink-400">{hint}</p></button>)}</div>
      <motion.div layout className="mt-5 rounded-2xl border border-paper-line bg-white p-5">{method === 'UPI' && <label className="block"><span className="text-xs font-medium text-ink-500">UPI ID</span><input className="mt-1.5 h-12 w-full rounded-xl border border-paper-line px-3 text-sm outline-none focus:border-signal-500" placeholder="name@upi" /></label>}{method === 'Card' && <div className="space-y-3"><label className="block text-xs font-medium text-ink-500">Card number<input className="mt-1.5 h-12 w-full rounded-xl border border-paper-line px-3 text-sm outline-none focus:border-signal-500" placeholder="1234 5678 9012 3456" /></label><div className="grid grid-cols-2 gap-3"><input className="h-12 rounded-xl border border-paper-line px-3 text-sm" placeholder="MM / YY" /><input className="h-12 rounded-xl border border-paper-line px-3 text-sm" placeholder="CVV" /></div></div>}{method === 'Wallet' && <label className="block"><span className="text-xs font-medium text-ink-500">Wallet provider</span><select className="mt-1.5 h-12 w-full rounded-xl border border-paper-line px-3 text-sm outline-none focus:border-signal-500"><option>Choose wallet</option><option>Paytm</option><option>PhonePe</option><option>Amazon Pay</option></select></label>}</motion.div>
      {paymentError && <p className="mt-4 rounded-xl bg-coral-400/10 px-4 py-3 text-sm text-coral-600">{paymentError}</p>}
      <Button size="lg" className="mt-6 w-full" onClick={pay} disabled={processing || success}>{success ? <>Payment successful <Check className="h-4 w-4" /></> : processing ? <motion.span className="inline-flex items-center gap-2" animate={{ opacity: [0.45, 1, 0.45] }} transition={{ repeat: Infinity, duration: 1.1 }}>Authorising secure transaction…</motion.span> : <>Pay ₹{total.toLocaleString('en-IN')} <ArrowRight className="h-4 w-4" /></>}</Button>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-400"><ShieldCheck className="h-3.5 w-3.5 text-signal-600" /> Demo transaction flow · use test credentials only</div>
    </Card>
    <aside><Card className="sticky top-24 overflow-hidden"><div className="bg-ink-950 p-6 text-white"><p className="text-xs uppercase tracking-[0.14em] text-white/40">Trip summary</p><h2 className="mt-2 font-display text-xl font-semibold">{trip.operator}</h2><p className="mt-1 text-sm text-white/55">{trip.departureTime} → {trip.arrivalTime}</p></div><div className="p-6"><div className="space-y-3 text-sm"><Row label="Base fare" value={`₹${trip.price.toLocaleString('en-IN')}`} /><Row label="Seat fee" value={`₹${seatFee.toLocaleString('en-IN')}`} /><Row label="Taxes" value={`₹${taxes.toLocaleString('en-IN')}`} /><div className="my-4 border-t border-paper-line" /><Row label="Total" value={`₹${total.toLocaleString('en-IN')}`} strong /></div><div className="mt-5 rounded-xl bg-paper-dim p-4 text-xs leading-relaxed text-ink-500"><b className="text-ink-900">Transaction protection.</b> A unique transaction ID is generated for this booking and stored separately from your ticket record.</div></div></Card></aside>
  </div></Container></div>
}
function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) { return <div className={`flex justify-between gap-4 ${strong ? 'font-semibold text-ink-950' : ''}`}><span className={strong ? '' : 'text-ink-500'}>{label}</span><span>{value}</span></div> }
