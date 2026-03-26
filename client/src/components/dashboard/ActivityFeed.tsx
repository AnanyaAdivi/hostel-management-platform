import { formatDistanceToNow } from 'date-fns'
import StatusBadge from '@/components/shared/StatusBadge'

export interface ActivityItem {
  id: string
  title: string
  subtitle: string
  status?: string
  timestamp?: string
}

export default function ActivityFeed({
  title,
  items,
}: {
  title: string
  items: ActivityItem[]
}) {
  return (
    <div className="card">
      <h3 style={{ fontFamily: 'Sora', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              padding: '12px 0',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 3 }}>
                {item.subtitle}
                {item.timestamp
                  ? ` · ${formatDistanceToNow(new Date(item.timestamp), {
                      addSuffix: true,
                    })}`
                  : ''}
              </div>
            </div>
            {item.status ? <StatusBadge status={item.status} /> : null}
          </div>
        ))}
      </div>
    </div>
  )
}
