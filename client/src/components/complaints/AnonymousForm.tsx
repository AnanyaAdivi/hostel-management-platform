import { useState } from 'react'
import { Copy, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import ComplaintForm from './ComplaintForm'

export default function AnonymousForm() {
  const [token, setToken] = useState<string | null>(null)

  if (token) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(108,99,255,0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <EyeOff size={26} color="var(--accent-primary)" />
        </div>
        <h3 style={{ fontFamily: 'Sora', fontSize: 20, marginBottom: 8 }}>
          Complaint Submitted
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
          Save this token to track the complaint without revealing your identity.
        </p>
        <div
          style={{
            background: 'var(--bg-tertiary)',
            padding: '1rem 1.25rem',
            borderRadius: 12,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 20,
            letterSpacing: 1.2,
            marginBottom: 16,
            color: 'var(--accent-secondary)',
          }}
        >
          {token}
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            navigator.clipboard.writeText(token)
            toast.success('Token copied')
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <Copy size={16} />
          Copy Token
        </button>
      </div>
    )
  }

  return <ComplaintForm anonymous onSuccess={(result) => setToken((result as { token: string }).token)} />
}
