import React from 'react'

export default function RevenueLine({ device, breakItMode }) {
  if (!device?.revenueNote) return null

  // Highlight dollar amounts in the note
  const parts = device.revenueNote.split(/(est\. \$[\d,]+[^→]*)/)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      padding: '7px 14px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderTop: breakItMode ? '1px solid rgba(255, 77, 0, 0.2)' : '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0,
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: '0.5625rem',
        fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>
        💸 Revenue impact
      </span>
      <span style={{
        fontSize: '0.6875rem',
        fontFamily: 'var(--font-mono)',
        color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.5,
      }}>
        {parts.map((part, i) =>
          part.startsWith('est.') ? (
            <span key={i} style={{ color: '#FF4D00', fontWeight: 500 }}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
        <span style={{
          marginLeft: 8,
          fontSize: '0.5625rem',
          color: 'rgba(255,255,255,0.18)',
          fontStyle: 'italic',
        }}>
          (illustrative)
        </span>
      </span>
    </div>
  )
}
