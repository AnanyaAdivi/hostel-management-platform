import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import OfflineBanner from '@/components/shared/OfflineBanner'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import { queryClient } from '@/lib/queryClient'
import { useAuthStore } from '@/store/authStore'
import AppLayout from '@/components/layout/AppLayout'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import StudentDashboard from '@/pages/student/StudentDashboard'
import MyRoomPage from '@/pages/student/MyRoomPage'
import ComplaintsPage from '@/pages/student/ComplaintsPage'
import AnonymousComplaintPage from '@/pages/student/AnonymousComplaintPage'
import TrackComplaintPage from '@/pages/student/TrackComplaintPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import RoomManagement from '@/pages/admin/RoomManagement'
import ComplaintsAdmin from '@/pages/admin/ComplaintsAdmin'
import MaintenanceAdmin from '@/pages/admin/MaintenanceAdmin'
import StudentManagement from '@/pages/admin/StudentManagement'
import WardenDashboard from '@/pages/warden/WardenDashboard'

function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: string[]
}) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function useAuthHydrationReady() {
  const [ready, setReady] = useState(() =>
    useAuthStore.persist.hasHydrated()
  )

  useEffect(() => {
    const unsubHydrate = useAuthStore.persist.onHydrate(() => setReady(false))
    const unsubFinish = useAuthStore.persist.onFinishHydration(() =>
      setReady(true)
    )

    setReady(useAuthStore.persist.hasHydrated())

    const timer = window.setTimeout(() => {
      setReady(true)
    }, 2500)

    return () => {
      window.clearTimeout(timer)
      unsubHydrate()
      unsubFinish()
    }
  }, [])

  return ready
}

export default function App() {
  const { user } = useAuthStore()
  const authHydrationReady = useAuthHydrationReady()

  if (!authHydrationReady) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <OfflineBanner />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/track" element={<TrackComplaintPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route
                path="dashboard"
                element={
                  user?.role === 'ADMIN' ? (
                    <AdminDashboard />
                  ) : user?.role === 'WARDEN' ? (
                    <WardenDashboard />
                  ) : (
                    <StudentDashboard />
                  )
                }
              />
              <Route
                path="rooms"
                element={
                  <ProtectedRoute roles={['ADMIN', 'WARDEN']}>
                    <RoomManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-room"
                element={
                  <ProtectedRoute roles={['STUDENT']}>
                    <MyRoomPage />
                  </ProtectedRoute>
                }
              />
              <Route path="complaints" element={<ComplaintsPage />} />
              <Route
                path="complaints/anonymous"
                element={<AnonymousComplaintPage />}
              />
              <Route
                path="admin/complaints"
                element={
                  <ProtectedRoute roles={['ADMIN', 'WARDEN']}>
                    <ComplaintsAdmin />
                  </ProtectedRoute>
                }
              />
              <Route path="maintenance" element={<MaintenanceAdmin />} />
              <Route
                path="students"
                element={
                  <ProtectedRoute roles={['ADMIN', 'WARDEN']}>
                    <StudentManagement />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
