'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{
        fontSize: '2.5rem',
        color: '#DB7F8E',
        marginBottom: '20px'
      }}>Something went wrong!</h2>
      <p style={{
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '30px'
      }}>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '15px 40px',
          background: 'linear-gradient(135deg, #DB7F8E, #604D53)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  )
}
