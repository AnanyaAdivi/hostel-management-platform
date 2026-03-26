import type { LucideIcon } from 'lucide-react'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'rgba(108,99,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
        }}
      >
        <Icon size={28} color="var(--accent-primary)" />
      </div>
      <h3 style={{ fontFamily: 'Sora', fontSize: 18, marginBottom: 8 }}>{title}</h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: 14,
          maxWidth: 420,
          margin: '0 auto',
        }}
      >
        {description}
      </p>
      {action ? <div style={{ marginTop: 18 }}>{action}</div> : null}
    </div>
  )
}
