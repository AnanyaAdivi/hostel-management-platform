import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import api from '@/services/api'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isHydrated: boolean
  isBootstrapping: boolean
  login: (email: string, password: string) => Promise<void>
  refreshSession: () => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,
      isBootstrapping: false,

      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        localStorage.setItem('accessToken', res.data.accessToken)
        set({
          user: res.data.user,
          accessToken: res.data.accessToken,
          isAuthenticated: true,
        })
      },

      refreshSession: async () => {
        if (!get().isAuthenticated) {
          return false
        }

        set({ isBootstrapping: true })

        try {
          const res = await axios.post(
            import.meta.env.VITE_API_URL + '/api/v1/auth/refresh',
            {},
            { withCredentials: true }
          )

          const { accessToken } = res.data
          localStorage.setItem('accessToken', accessToken)
          set({
            accessToken,
            isAuthenticated: true,
            isBootstrapping: false,
          })
          return true
        } catch (error: any) {
          if (error.response?.status === 401) {
            localStorage.removeItem('accessToken')
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              isBootstrapping: false,
            })
            return false
          }

          set({ isBootstrapping: false })
          throw error
        }
      },

      logout: () => {
        api.post('/auth/logout').catch(() => {})
        localStorage.removeItem('accessToken')
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isBootstrapping: false,
        })
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ isHydrated: true })
      },
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
