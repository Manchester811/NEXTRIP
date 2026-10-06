import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, Phone, UserRound } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getSelectedTrip } from '@/services/bookingStore'

interface Passenger { name: string; age: number; gender: string }

export default function PassengerDetails() {
  const navigate = useNavigate()
  const trip = getSelectedTrip()
  const seats = JSON.parse(sessionStorage.getItem('nextrip:selected-seats') ?? '[]') as string[]
  const [passengers, setPassengers] = useState<Passenger[]>(seats.map(() => ({ name: '', age: 0, gender: 'Prefer not to say' })))
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const seatFee = seats.length * Math.max(50, Math.round((trip?.price ?? 0) / 6))
  const taxes = Math.round((trip?.price ?? 0) * 0.05)
  const total = useMemo(() => (trip?.price ?? 0) + seatFee + taxes, [trip?.price, seatFee, taxes])

  if (!trip) return <Container className="py-24 text-center"><p>No trip selected.</p></Container>

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (passengers.some((p) => !p.name.trim() || p.age <= 0 || !p.gender.trim()) || !email.includes('@') || phone.trim().length < 8) { setError('Please complete every passenger and contact field.'); return }
    setError('')
    sessionStorage.setItem('nextrip:passengers', JSON.stringify(passengers))
    sessionStorage.setItem('nextrip:contact', JSON.stringify({ email, phone }))
    navigate('/payment')
  }

  return <div className="min-h-screen bg-paper-dim pb-20"><Container className="pt-7"><button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-950"><ArrowLeft className="h-4 w-4" /> Back</button><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]"><form onSubmit={submit} className="space-y-5"><Card className="p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Passenger details</p><h1 className="mt-2 font-display text-2xl font-semibold">Who's travelling?</h1><p className="mt-1 text-sm text-ink-500">Enter details exactly as they should appear on the ticket.</p><div className="mt-6 space-y-4">{passengers.map((passenger, index) => <div key={index} className="rounded-xl border border-paper-line p-4"><div className="mb-4 flex items-center justify-between"><p className="font-semibold">Passenger {index + 1}</p><span className="font-mono text-xs text-ink-400">{seats[index]}</span></div><div className="grid gap-3 sm:grid-cols-3"><label className="sm:col-span-2"><span className="text-xs font-medium text-ink-500">Full name</span><div className="relative mt-1"><UserRound className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><input value={passenger.name} onChange={(e) => setPassengers((all) => all.map((p, i) => i === index ? { ...p, name: e.target.value } : p))} className="h-11 w-full rounded-lg border border-paper-line bg-white pl-9 pr-3 text-sm outline-none focus:border-signal-500" placeholder="Full name" /></div></label><label><span className="text-xs font-medium text-ink-500">Age</span><input value={String(passenger.age)} onChange={(e) => setPassengers((all) => all.map((p, i) => i === index ? { ...p, age: Math.max(1, Number(e.target.value) || 0) } : p))} className="mt-1 h-11 w-full rounded-lg border border-paper-line bg-white px-3 text-sm outline-none focus:border-signal-500" inputMode="numeric" placeholder="Age" /></label></div><label className="mt-3 block"><span className="text-xs font-medium text-ink-500">Gender</span><select value={passenger.gender} onChange={(e) => setPassengers((all) => all.map((p, i) => i === index ? { ...p, gender: e.target.value } : p))} className="mt-1 h-11 w-full rounded-lg border border-paper-line bg-white px-3 text-sm outline-none focus:border-signal-500"><option>Prefer not to say</option><option>Female</option><option>Male</option><option>Other</option></select></label></div>)}</div></Card><Card className="p-6 sm:p-8"><h2 className="font-display text-xl font-semibold">Contact details</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label><span className="text-xs font-medium text-ink-500">Email</span><div className="relative mt-1"><Mail className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full rounded-lg border border-paper-line bg-white pl-9 pr-3 text-sm outline-none focus:border-signal-500" placeholder="you@example.com" /></div></label><label><span className="text-xs font-medium text-ink-500">Phone</span><div className="relative mt-1"><Phone className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 w-full rounded-lg border border-paper-line bg-white pl-9 pr-3 text-sm outline-none focus:border-signal-500" placeholder="+91 98765 43210" /></div></label></div>{error && <p className="mt-4 rounded-lg bg-coral-400/10 px-3 py-2 text-sm text-coral-600">{error}</p>}</Card><Button type="submit" size="lg" variant="primary" className="w-full">Continue to payment <ArrowRight className="h-4 w-4" /></Button></form><aside><Card className="sticky top-24 p-6"><p className="text-xs uppercase tracking-[0.14em] text-ink-400">Summary</p><h2 className="mt-2 font-display text-xl font-semibold">{trip.operator}</h2><p className="mt-1 text-sm text-ink-500">{trip.departureTime} → {trip.arrivalTime}</p><div className="my-5 border-y border-paper-line py-5 text-sm"><div className="flex justify-between"><span className="text-ink-500">Seats</span><span>{seats.join(', ')}</span></div><div className="mt-3 flex justify-between"><span className="text-ink-500">Passengers</span><span>{passengers.length}</span></div><div className="mt-3 flex justify-between font-semibold"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div></div><p className="text-xs leading-relaxed text-ink-400">Your contact details are used only to send your booking confirmation and ticket.</p></Card></aside></div></Container></div>
}
