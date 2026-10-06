import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const seats = [
  { row: 'A', seats: [{ id: 'A1', status: 'available' }, { id: 'A2', status: 'available' }, { id: 'A3', status: 'occupied' }] },
  { row: 'B', seats: [{ id: 'B1', status: 'available' }, { id: 'B2', status: 'selected' }, { id: 'B3', status: 'available' }] },
  { row: 'C', seats: [{ id: 'C1', status: 'occupied' }, { id: 'C2', status: 'available' }, { id: 'C3', status: 'available' }] },
  { row: 'D', seats: [{ id: 'D1', status: 'available' }, { id: 'D2', status: 'available' }, { id: 'D3', status: 'occupied' }] },
]

export default function SeatSelection() {
  const navigate = useNavigate()
  const [selectedSeat, setSelectedSeat] = useState('B2')

  return (
    <main className="min-h-screen bg-[#030B16] pb-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 pt-24 pb-12">
        <Link to="/trip/t1" className="inline-flex items-center gap-2 text-sm font-medium text-[#8B98A8] hover:text-[#F5F7FA] transition-colors mb-8"><ArrowLeft className="h-4 w-4" /> Back to trip</Link>
        <h1 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.03em] text-[#F5F7FA] leading-tight mb-4">Choose your seat</h1>
        <p className="text-[#8B98A8] text-lg max-w-xl">Select a comfortable seat. Availability updates in real time.</p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12 mt-10">
          {/* Seat map */}
          <div className="rounded-[28px] bg-[#091A2B] border border-white/[0.07] p-8 lg:p-10">
            <div className="flex items-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/40" /> <span className="text-[#8B98A8]">Selected</span></div>
              <div className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-white/[0.05] border border-white/[0.10]" /> <span className="text-[#8B98A8]">Available</span></div>
              <div className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-full bg-[#0C2034] border border-white/[0.05]" /> <span className="text-[#8B98A8]">Occupied</span></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left text-[#8B98A8] font-medium pb-3">Row</th>
                    <th className="text-center text-[#8B98A8] font-medium pb-3">01</th>
                    <th className="text-center text-[#8B98A8] font-medium pb-3">02</th>
                    <th className="text-center text-[#8B98A8] font-medium pb-3">03</th>
                  </tr>
                </thead>
                <tbody>
                  {seats.map(row => (
                    <tr key={row.row} className="border-t border-white/[0.05]">
                      <td className="py-3 font-display font-bold text-[#F5F7FA] text-lg">{row.row}</td>
                      {row.seats.map(s => (
                        <td key={s.id} className="py-3 text-center">
                          {s.status === 'occupied' ? (
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#0C2034] border border-white/[0.05] text-[#5A6B7E] text-xs font-mono">×</span>
                          ) : (
                            <button
                              onClick={() => s.status === 'available' && setSelectedSeat(s.id)}
                              aria-label={`Seat ${s.id}`}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-mono transition-all ${s.id === selectedSeat ? 'bg-[#3B82F6]/10 border-[#3B82F6]/50 text-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.3)]' : s.status === 'available' ? 'bg-white/[0.05] border-white/[0.10] text-[#8B98A8] hover:border-[#3B82F6]/40 hover:text-[#3B82F6]' : ''}`}
                            >
                              {s.id === selectedSeat ? <Check className="h-3.5 w-3.5" /> : s.id.slice(-1)}
                            </button>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side card */}
          <aside className="lg:pt-2">
            <div className="rounded-[28px] bg-[#091A2B] border border-white/[0.07] p-7 lg:p-8 sticky top-28">
              <div className="text-xs font-medium text-[#8B98A8] uppercase tracking-wider mb-1">Selected</div>
              <div className="font-display text-3xl font-bold text-[#F5F7FA] mb-6">{selectedSeat}</div>
              <div className="space-y-3 text-sm mb-8">
                <Row label="Journey" value="Vellore → Chennai" />
                <Row label="Date" value="12 Oct 2026" />
                <Row label="Departure" value="08:30 AM" />
                <Row label="Operator" value="ACME Travels" />
              </div>
              <button onClick={() => navigate('/passenger-details')} className="w-full rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold px-6 py-3.5 shadow-[0_8px_30px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">Continue <ArrowRight className="h-4 w-4" /></button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between text-sm"><span className="text-[#8B98A8]">{label}</span><span className="text-[#F5F7FA] font-medium">{value}</span></div>
}
