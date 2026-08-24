import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'

const Home = lazy(() => import('@/pages/Home'))
const SearchResults = lazy(() => import('@/pages/SearchResults'))
const TripDetails = lazy(() => import('@/pages/TripDetails'))
const SeatSelection = lazy(() => import('@/pages/SeatSelection'))
const PassengerDetails = lazy(() => import('@/pages/PassengerDetails'))
const Payment = lazy(() => import('@/pages/Payment'))
const Confirmation = lazy(() => import('@/pages/Confirmation'))
const Bookings = lazy(() => import('@/pages/Bookings'))
const Auth = lazy(() => import('@/pages/Auth'))
const Help = lazy(() => import('@/pages/Help'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const Profile = lazy(() => import('@/pages/Profile'))
const Placeholder = lazy(() => import('@/pages/Placeholder'))

function PageFallback() { return <div className="flex min-h-[60vh] items-center justify-center bg-paper"><div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-signal-600" /></div> }

export default function App() {
  return <Suspense fallback={<PageFallback />}><Routes><Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/trip/:id" element={<TripDetails />} />
    <Route path="/seat-selection/:id" element={<SeatSelection />} />
    <Route path="/passenger-details" element={<PassengerDetails />} />
    <Route path="/payment" element={<Payment />} />
    <Route path="/confirmation/:id" element={<Confirmation />} />
    <Route path="/bookings" element={<Bookings />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/login" element={<Auth mode="login" />} />
    <Route path="/register" element={<Auth mode="register" />} />
    <Route path="/help" element={<Help />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/about" element={<Placeholder title="About NEXTRIP" description="A multi-modal travel platform built around one simple idea: every journey, one platform." />} />
    <Route path="*" element={<Placeholder title="Page not found" description="Let's get you back on route." />} />
  </Route></Routes></Suspense>
}
