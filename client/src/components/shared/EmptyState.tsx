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
      className="card-gradient"
      style={{
        textAlign: 'center',
        padding: '3.5rem 2rem',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(108,99,255,0.1)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      
      <div
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(34,211,238,0.1))',
            border: '1px solid rgba(108,99,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Icon size={32} color="var(--accent-primary)" />
        </div>
        <h3 style={{ fontFamily: 'Sora', fontSize: 20, marginBottom: 8, fontWeight: 600 }}>{title}</h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 15,
            maxWidth: 450,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
        {action ? <div style={{ marginTop: 24 }}>{action}</div> : null}
      </div>
    </div>
  )
}
