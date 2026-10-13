import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'
import EventForm from './pages/EventForm'
import MyRegistrations from './pages/MyRegistrations'
import MyCertificates from './pages/MyCertificates'
import CheckInScanner from './pages/CheckInScanner'
import AdminEventReview from './pages/AdminEventReview'
import Institutions from './pages/Institutions'
import Categories from './pages/Categories'
import Users from './pages/Users'
import AuditLog from './pages/AuditLog'
import Profile from './pages/Profile'
import CertificateVerify from './pages/CertificateVerify'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Herkese açık, oturum gerektirmeyen sertifika doğrulama sayfası. */}
        <Route path="/verify/:code" element={<CertificateVerify />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/events/new" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
        <Route path="/events/:id/edit" element={<ProtectedRoute><EventForm /></ProtectedRoute>} />
        <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
        <Route path="/my-certificates" element={<ProtectedRoute><MyCertificates /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><CheckInScanner /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/admin/review" element={<ProtectedRoute roles={['ADMIN']}><AdminEventReview /></ProtectedRoute>} />
        <Route path="/admin/institutions" element={<ProtectedRoute roles={['ADMIN']}><Institutions /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute roles={['ADMIN']}><Categories /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><Users /></ProtectedRoute>} />
        <Route path="/admin/audit" element={<ProtectedRoute roles={['ADMIN']}><AuditLog /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
