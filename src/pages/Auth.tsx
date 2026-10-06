import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { getRememberedEmail, login, register } from '@/services/authStore'

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const remembered = getRememberedEmail()
  const [name, setName] = useState('')
  const [email, setEmail] = useState(remembered)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(Boolean(remembered))
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!email.includes('@') || password.length < 6 || (mode === 'register' && !name.trim())) {
      setError(mode === 'login' ? 'Enter a valid email and a password with at least 6 characters.' : 'Please complete your name, email and password.')
      return
    }
    setError('')
    setBusy(true)
    window.setTimeout(() => {
      if (mode === 'register') register(name.trim(), email.trim(), remember)
      else login(email.trim(), 'Traveller', remember)
      setBusy(false)
      navigate((location.state as { from?: string } | null)?.from ?? '/')
    }, 650)
  }

  return <div className="min-h-[calc(100vh-80px)] bg-paper-dim py-10 sm:py-16"><Container><div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-paper-line bg-white shadow-2xl shadow-ink-950/10 lg:grid-cols-[1.05fr_0.95fr]">
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative hidden overflow-hidden bg-ink-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-signal-500/20 blur-3xl" /><div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
      <div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"><ShieldCheck className="h-3.5 w-3.5 text-signal-300" /> Secure NEXTRIP account</span><h1 className="mt-10 max-w-lg font-display text-5xl font-semibold leading-[1.02]">Every journey.<br /><span className="text-signal-300">One account.</span></h1><p className="mt-6 max-w-md text-sm leading-7 text-white/55">Keep your journeys, travellers and digital tickets together in one beautifully simple travel hub.</p><div className="mt-10 grid max-w-md grid-cols-3 gap-3">{['Instant tickets', 'Smart bookings', 'Secure checkout'].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-medium text-white/70">{item}</p></div>)}</div></div><p className="relative text-xs text-white/30">NEXTRIP · Every journey, one platform.</p>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-7 sm:p-10 lg:p-12"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-700">{mode === 'login' ? 'Welcome back' : 'Start travelling'}</p><h2 className="mt-2 font-display text-3xl font-semibold text-ink-950">{mode === 'login' ? 'Sign in to NEXTRIP' : 'Create your account'}</h2><p className="mt-2 text-sm text-ink-500">{mode === 'login' ? 'Continue where you left off.' : 'Book faster and keep every ticket in one place.'}</p>
      <form onSubmit={submit} className="mt-8 space-y-4">{mode === 'register' && <Field icon={UserRound} label="Full name" value={name} onChange={setName} placeholder="Your full name" />}{<Field icon={Mail} label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />}{<div><Field icon={LockKeyhole} label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={setPassword} placeholder="At least 6 characters" trailing={<button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-2.5 text-ink-400 hover:text-ink-900" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} /></div>}
        {mode === 'login' && <div className="flex items-center justify-between"><label className="flex items-center gap-2 text-xs text-ink-500"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-signal-600" /> Remember this email</label><button type="button" className="text-xs font-semibold text-signal-700">Forgot password?</button></div>}
        {error && <p className="rounded-xl bg-coral-400/10 px-4 py-3 text-sm text-coral-600">{error}</p>}
        <Button type="submit" size="lg" disabled={busy} className="w-full">{busy ? 'Signing you in…' : mode === 'login' ? 'Sign in' : 'Create account'} {!busy && <ArrowRight className="h-4 w-4" />}</Button>
      </form><p className="mt-7 text-center text-sm text-ink-500">{mode === 'login' ? <>New to NEXTRIP? <Link className="font-semibold text-signal-700" to="/register">Create an account</Link></> : <>Already have an account? <Link className="font-semibold text-signal-700" to="/login">Sign in</Link></>}</p><p className="mt-6 text-center text-[11px] leading-relaxed text-ink-400">Your password is never stored in browser storage. Authentication state is kept separately from credentials.</p>
    </motion.div>
  </div></Container></div>
}
function Field({ icon: Icon, label, value, onChange, placeholder, type = 'text', trailing }: { icon: typeof Mail; label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; trailing?: ReactNode }) { return <label className="block"><span className="text-xs font-medium text-ink-500">{label}</span><div className="relative mt-1.5"><Icon className="absolute left-3 top-3 h-4 w-4 text-ink-400" /><input required type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-12 w-full rounded-xl border border-paper-line bg-paper/50 pl-10 pr-10 text-sm outline-none transition focus:border-signal-500 focus:bg-white focus:ring-4 focus:ring-signal-500/10" />{trailing}</div></label> }
