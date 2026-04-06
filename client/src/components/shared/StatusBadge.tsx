const config: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: {
    label: 'Pending',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: '#6C63FF',
    bg: 'rgba(108,99,255,0.12)',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: '#22D3EE',
    bg: 'rgba(34,211,238,0.12)',
  },
  RESOLVED: {
    label: 'Resolved',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.12)',
  },
  REJECTED: {
    label: 'Rejected',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
  },
  AVAILABLE: {
    label: 'Available',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.12)',
  },
  OCCUPIED: {
    label: 'Occupied',
    color: '#6C63FF',
    bg: 'rgba(108,99,255,0.12)',
  },
  MAINTENANCE: {
    label: 'Maintenance',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.12)',
  },
  RESERVED: {
    label: 'Reserved',
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.12)',
  },
}

export default function StatusBadge({ status }: { status: string }) {
  const c = config[status] || {
    label: status,
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.12)',
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 8,
        background: c.bg,
        color: c.color,
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        border: `1px solid ${c.color}22`,
        backdropFilter: 'blur(4px)',
        transition: 'all 0.2s',
        fontFamily: 'DM Sans',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: c.color,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  )
}
