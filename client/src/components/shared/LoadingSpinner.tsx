export default function LoadingSpinner({
  fullScreen = false,
}: {
  fullScreen?: boolean
}) {
  const spinner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '3px solid rgba(108,99,255,0.2)',
          borderTopColor: 'var(--accent-primary)',
          animation: 'spin 0.7s linear infinite',
        }}
      />
      <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
        Loading...
      </span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-primary)',
        }}
      >
        {spinner}
      </div>
    )
  }

  return <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>{spinner}</div>
}
