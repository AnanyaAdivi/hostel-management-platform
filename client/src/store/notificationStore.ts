import { create } from 'zustand'
import type { Notification } from '@/types'

type IncomingNotification = Partial<Notification> &
  Pick<Notification, 'id' | 'title' | 'message' | 'type'>

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: IncomingNotification) => void
  markAllRead: () => void
  setNotifications: (ns: Notification[]) => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        {
          ...n,
          isRead: n.isRead ?? false,
          createdAt: n.createdAt ?? new Date().toISOString(),
        } as Notification,
        ...state.notifications,
      ].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    })),
  markAllRead: () =>
    set((state) => ({
      unreadCount: 0,
      notifications: state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    })),
  setNotifications: (ns) =>
    set({ notifications: ns, unreadCount: ns.filter((n) => !n.isRead).length }),
}))
