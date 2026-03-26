import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import api from '@/services/api'
import StatusBadge from '@/components/shared/StatusBadge'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import StatusTracker from '@/components/complaints/StatusTracker'

export default function TrackComplaintPage() {
  const [token, setToken] = useState('')
  const [submittedToken, setSubmittedToken] = useState('')

  const trackQuery = useQuery({
    queryKey: ['track-complaint', submittedToken],
    queryFn: () =>
      api.get(`/complaints/track/${submittedToken}`).then((res) => res.data as any),
    enabled: !!submittedToken,
    retry: false,
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
      }}
    >
      <div style={{ width: '100%', maxWidth: 640, display: 'grid', gap: 20 }}>
        <div className="card-glass" style={{ padding: '2rem' }}>
          <h1 style={{ fontFamily: 'Sora', fontSize: 24, marginBottom: 8 }}>Track Complaint</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 18 }}>
            Enter the complaint token to view the latest status update.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value.toUpperCase())}
              placeholder="Enter complaint token"
              style={{
                flex: 1,
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                padding: '12px 14px',
                color: 'var(--text-primary)',
              }}
            />
            <button
              className="btn-primary"
              onClick={() => setSubmittedToken(token.trim())}
              disabled={!token.trim()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Search size={16} />
              Track
            </button>
          </div>
        </div>

        {trackQuery.isFetching ? <LoadingSpinner /> : null}
        {trackQuery.isError ? (
          <div className="card" style={{ color: 'var(--accent-danger)' }}>
            Complaint not found. Check the token and try again.
          </div>
        ) : null}

        {trackQuery.data ? (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontFamily: 'Sora', fontSize: 20 }}>{trackQuery.data.title}</div>
                <div style={{ color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {trackQuery.data.category} · {trackQuery.data.token}
                </div>
              </div>
              <StatusBadge status={trackQuery.data.status} />
            </div>
            {'description' in trackQuery.data ? (
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 16 }}>
                {trackQuery.data.description}
              </p>
            ) : null}
            {trackQuery.data.adminNote ? (
              <div
                style={{
                  marginTop: 16,
                  padding: '0.9rem 1rem',
                  borderRadius: 10,
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.16)',
                }}
              >
                <strong style={{ color: 'var(--accent-secondary)' }}>Admin note:</strong>{' '}
                {trackQuery.data.adminNote}
              </div>
            ) : null}
            <div style={{ marginTop: 18 }}>
              <StatusTracker status={trackQuery.data.status} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
