import { Bell, CalendarDays, Search, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { useAuthStore } from '@/store/authStore'
import { useNotificationStore } from '@/store/notificationStore'

export default function Header() {
  const { user } = useAuthStore()
  const { unreadCount } = useNotificationStore()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'blur(14px)',
        background: 'rgba(10,15,30,0.75)',
        borderBottom: '1px solid var(--border-default)',
        padding: '1rem 2rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--accent-secondary)',
              fontSize: 12,
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
            }}
          >
            <Sparkles size={12} />
            Hostel Operations
          </div>
          <h2 style={{ fontFamily: 'Sora', fontSize: 20, margin: 0 }}>
            {user ? `Welcome, ${user.name.split(' ')[0]}` : 'Hostel Portal'}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="card-glass"
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 220,
            }}
          >
            <Search size={16} color="var(--text-tertiary)" />
            <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
              Search rooms, complaints, rules
            </span>
          </div>

          <div className="card-glass" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarDays size={16} color="var(--accent-secondary)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {format(new Date(), 'EEE, dd MMM yyyy')}
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              className="card-glass"
              style={{
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
              }}
            >
              <Bell size={18} color="var(--text-primary)" />
            </div>
            {unreadCount > 0 ? (
              <span
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  borderRadius: 999,
                  background: 'var(--accent-danger)',
                  color: 'white',
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingInline: 4,
                }}
              >
                {Math.min(unreadCount, 9)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
