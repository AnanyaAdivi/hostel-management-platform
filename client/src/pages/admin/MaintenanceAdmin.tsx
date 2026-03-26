import { CalendarClock, Wrench } from 'lucide-react'
import EmptyState from '@/components/shared/EmptyState'

export default function MaintenanceAdmin() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: 'Sora', fontSize: 24, margin: 0 }}>Maintenance</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
          Operational view for upcoming and active maintenance work.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Wrench size={18} color="var(--accent-warning)" />
            <h3 style={{ margin: 0, fontFamily: 'Sora', fontSize: 16 }}>Workflow</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            This section is ready for maintenance task CRUD in the next backend increment.
            The navigation, protected route, and visual shell are already wired.
          </p>
        </div>
        <EmptyState
          icon={CalendarClock}
          title="No maintenance feed connected yet"
          description="The backend task list endpoint is not part of the current implementation set, so this page is intentionally scoped to the prepared UI shell."
        />
      </div>
    </div>
  )
}
