import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { getSocket, disconnectSocket } from '@/lib/socket'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'

export const useSocket = () => {
  const { isAuthenticated } = useAuthStore()
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    if (!isAuthenticated) return

    const socket = getSocket()
    socket.auth = { token: localStorage.getItem('accessToken') }
    socket.connect()

    socket.on('notification', (data) => {
      addNotification(data)
      toast(data.message, {
        icon: data.type === 'success' ? '✅' : '🔔',
        style: {
          background: '#1A2235',
          color: '#F1F5F9',
          border: '1px solid rgba(255,255,255,0.08)',
        },
      })
    })

    socket.on('announcement', (data) => {
      toast(data.title, {
        icon: data.isUrgent ? '⚠️' : '📢',
        duration: data.isUrgent ? 8000 : 4000,
        style: {
          background: '#1A2235',
          color: '#F1F5F9',
          border: `1px solid ${data.isUrgent ? '#F59E0B' : 'rgba(255,255,255,0.08)'}`,
        },
      })
    })

    return () => {
      socket.off('notification')
      socket.off('announcement')
      disconnectSocket()
    }
  }, [addNotification, isAuthenticated])
}
