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
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
      }}
    >
      {items.map(({ icon: Icon, label, value, sub, color }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="card"
          style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: `${color}22`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={22} color={color} />
          </div>
          <div>
            <div
              style={{
                fontSize: 28,
                fontFamily: 'Sora',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {label}
            </div>
            {sub ? <div style={{ fontSize: 12, color, marginTop: 4 }}>{sub}</div> : null}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
