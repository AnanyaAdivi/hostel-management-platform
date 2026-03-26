import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
  const store = useAuthStore()

  return {
    ...store,
    isAdmin: store.user?.role === 'ADMIN',
    isWarden: store.user?.role === 'WARDEN',
    isStudent: store.user?.role === 'STUDENT',
  }
}
