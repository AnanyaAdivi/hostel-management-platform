import type { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export interface StatItem {
  icon: LucideIcon
  label: string
  value: string | number
  sub?: string
  color: string
}

export default function StatsGrid({ items }: { items: StatItem[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
      }}
    >
      {items.map(({ icon: Icon, label, value, sub, color }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="card-gradient"
          style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: 16,
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `${color}15`,
              filter: 'blur(20px)',
            }}
          />
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: `${color}22`,
              border: `1px solid ${color}44`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Icon size={24} color={color} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: 28,
                fontFamily: 'Sora',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                letterSpacing: '-0.5px',
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 500 }}>
              {label}
            </div>
            {sub ? <div style={{ fontSize: 12, color, marginTop: 8, fontWeight: 600 }}>{sub}</div> : null}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
