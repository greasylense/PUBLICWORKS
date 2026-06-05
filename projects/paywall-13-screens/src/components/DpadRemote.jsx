import React from 'react'

// CTV D-pad remote with SELECT and BACK
function DpadButton({ label, icon, style, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)',
        fontSize: 16,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.1s ease, transform 0.1s ease',
        fontFamily: 'inherit',
        lineHeight: 1,
        ...style,
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.92)' }}
      onMouseUp={e => { e.currentTarget.style.transform = '' }}
      onMouseLeave={e => { e.currentTarget.style.transform = '' }}
      aria-label={label}
    >
      {icon}
    </button>
  )
}

export function DpadRemote({ onNav, device, breakItMode }) {
  const isFocusTrap = breakItMode && (
    device.breakItBug?.type === 'focus-trap' ||
    device.breakItBug?.type === 'no-tabindex'
  )

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
    }}>
      <div style={{ fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
        Remote
      </div>

      {/* D-pad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gridTemplateRows: 'repeat(3, 44px)', gap: 4 }}>
        {/* Up */}
        <div />
        <DpadButton label="Up" icon="▲" onClick={() => onNav('up')} disabled={isFocusTrap} />
        <div />
        {/* Left, Select, Right */}
        <DpadButton label="Left" icon="◀" onClick={() => onNav('left')} />
        <DpadButton
          label="Select"
          icon={<span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>OK</span>}
          onClick={() => onNav('select')}
          style={{ background: 'rgba(255,255,255,0.14)', borderRadius: '50%' }}
        />
        <DpadButton label="Right" icon="▶" onClick={() => onNav('right')} />
        {/* Down */}
        <div />
        <DpadButton label="Down" icon="▼" onClick={() => onNav('down')} disabled={isFocusTrap} />
        <div />
      </div>

      {/* Back button */}
      <DpadButton
        label="Back"
        icon={<span style={{ fontSize: 13 }}>← Back</span>}
        onClick={() => onNav('back')}
        style={{ width: 'auto', padding: '0 16px', borderRadius: 8 }}
      />

      {isFocusTrap && (
        <div style={{
          fontSize: 11,
          color: '#fca5a5',
          textAlign: 'center',
          maxWidth: 180,
          lineHeight: 1.4,
        }}>
          {device.breakItBug?.type === 'no-tabindex'
            ? 'all navigation disabled — no tabindex'
            : '↑↓ disabled by focus trap'}
        </div>
      )}

      <div style={{ fontSize: '0.5625rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.18)', textAlign: 'center', letterSpacing: '0.04em' }}>
        or use ↑ ↓ ↵ keys
      </div>
    </div>
  )
}

export function TouchHint({ device }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 0,
      fontSize: '0.6875rem',
      fontFamily: 'var(--font-mono)',
      color: 'rgba(255,255,255,0.38)',
    }}>
      <span style={{ fontSize: 18 }}>👆</span>
      <span>
        Touch to interact · Min tap target{' '}
        <span style={{ color: 'rgba(255,255,255,0.65)' }}>
          {device.id === 'ios' ? '44×44 pt' : '48×48 dp'}
        </span>
        {device.breakItBug?.type === 'safe-area-hidden' && (
          <span style={{ color: '#fca5a5' }}> · CTA below safe area!</span>
        )}
      </span>
    </div>
  )
}

export function CursorHint({ device }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 0,
      fontSize: '0.6875rem',
      fontFamily: 'var(--font-mono)',
      color: 'rgba(255,255,255,0.38)',
    }}>
      <span style={{ fontSize: 16 }}>🖱</span>
      <span>
        Mouse + keyboard · Click buttons to interact
        {device.breakItBug?.type === 'css-quirk' && (
          <span style={{ color: '#fca5a5' }}> · backdrop-filter broken in break-it mode</span>
        )}
      </span>
    </div>
  )
}
