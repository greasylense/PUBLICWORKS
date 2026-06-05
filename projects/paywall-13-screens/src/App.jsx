import React, { useState, useCallback, useEffect, useRef } from 'react'
import { getDevice, SAMPLE_IMAGES } from './deviceProfiles'
import Editor from './components/Editor'
import DevicePicker from './components/DevicePicker'
import DeviceFrame from './components/DeviceFrame'
import { DpadRemote, TouchHint, CursorHint } from './components/DpadRemote'
import RevenueLine from './components/RevenueLine'

const DEFAULT_CONFIG = {
  heroImage: SAMPLE_IMAGES[0].url,
  headline: 'Unlimited Entertainment',
  subtext: 'Stream thousands of movies, shows, and more — all in one place.',
  price: '$9.99',
  period: 'month',
  ctaLabel: 'Start Free Trial',
  secondaryLabel: 'Restore Purchase',
  showSecondary: true,
  bgColor: '#0d0d1a',
  accentColor: '#6366f1',
}

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [activeId, setActiveId] = useState('apple-tv')
  const [breakIt, setBreakIt] = useState(false)
  const [focusIndex, setFocusIndex] = useState(0)
  const [activated, setActivated] = useState(null)
  const activatedTimer = useRef(null)

  const device = getDevice(activeId)
  const focusables = config.showSecondary ? ['cta', 'secondary'] : ['cta']
  const maxFocus = focusables.length - 1

  const isFocusTrap = breakIt && (
    device?.breakItBug?.type === 'focus-trap' ||
    device?.breakItBug?.type === 'no-tabindex'
  )

  const handleNav = useCallback(dir => {
    if (dir === 'up' || dir === 'down') {
      if (isFocusTrap) return
      setFocusIndex(prev =>
        dir === 'up'
          ? Math.max(0, prev - 1)
          : Math.min(maxFocus, prev + 1)
      )
    }
    if (dir === 'select') {
      const focused = focusables[focusIndex] ?? 'cta'
      handleActivate(focused)
    }
    if (dir === 'back') {
      setActivated(null)
    }
  }, [focusIndex, maxFocus, isFocusTrap, focusables])

  const handleActivate = useCallback(which => {
    clearTimeout(activatedTimer.current)
    setActivated(which)
    activatedTimer.current = setTimeout(() => setActivated(null), 2000)
  }, [])

  // Reset focus and activated when switching devices
  const handleDeviceSelect = id => {
    setActiveId(id)
    setFocusIndex(0)
    setActivated(null)

    // Fire TV focus trap starts stuck on secondary
    const d = getDevice(id)
    if (breakIt && d?.breakItBug?.type === 'focus-trap' && config.showSecondary) {
      setFocusIndex(1)
    }
  }

  // Update focus index when break-it mode changes for Fire TV (focus trap starts on secondary)
  useEffect(() => {
    if (breakIt && device?.breakItBug?.type === 'focus-trap' && config.showSecondary) {
      setFocusIndex(1)
    } else if (!breakIt) {
      setFocusIndex(0)
    }
  }, [breakIt, device?.id])

  // Keyboard D-pad navigation
  useEffect(() => {
    if (device?.inputModel !== 'dpad') return
    const handle = e => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
        e.preventDefault()
      }
      switch (e.key) {
        case 'ArrowUp':    handleNav('up'); break
        case 'ArrowDown':  handleNav('down'); break
        case 'ArrowLeft':  handleNav('left'); break
        case 'ArrowRight': handleNav('right'); break
        case 'Enter':      handleNav('select'); break
        case 'Escape':     handleNav('back'); break
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [device?.inputModel, handleNav])

  const hasBug = !!(device?.breakItBug)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      background: '#07070e',
    }}>
      {/* Back link — PW convention */}
      <a
        href="../../"
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.28)',
          zIndex: 200,
          textDecoration: 'none',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={e => e.target.style.color = '#0047FF'}
        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}
      >
        ← PUBLICWORKS
      </a>

      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px 0 140px',
        height: 52,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
        background: '#0a0a12',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h1 style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-sans)',
          }}>
            Paywall on 13 Screens
          </h1>
          <span style={{
            fontSize: '0.6875rem',
            fontFamily: 'var(--font-mono)',
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.04em',
          }}>
            Design one paywall. Watch it break across every platform.
          </span>
        </div>
        <div style={{
          fontSize: '0.625rem',
          fontFamily: 'var(--font-mono)',
          color: 'rgba(255,255,255,0.18)',
          letterSpacing: '0.06em',
          textAlign: 'right',
        }}>
          THE PAYWALL IS IDENTICAL EVERYWHERE. ONLY THE DEVICE CHANGES.
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Editor */}
        <Editor config={config} onChange={setConfig} />

        {/* Viewer */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
        }}>
          {/* Top bar: device picker + platform info + break-it */}
          <div style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            flexShrink: 0,
            background: '#090910',
          }}>
            <DevicePicker activeId={activeId} onSelect={handleDeviceSelect} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              {/* Break it toggle */}
              <button
                onClick={() => {
                  setBreakIt(v => !v)
                  setActivated(null)
                }}
                disabled={!hasBug}
                title={hasBug ? device.breakItBug.description : 'No bug defined for this device'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '5px 12px',
                  borderRadius: 0,
                  border: breakIt
                    ? '1px solid #FF4D00'
                    : '1px solid rgba(255,255,255,0.12)',
                  background: breakIt
                    ? 'rgba(255, 77, 0, 0.12)'
                    : hasBug ? 'transparent' : 'transparent',
                  color: breakIt
                    ? '#FF4D00'
                    : hasBug ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)',
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: hasBug ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {breakIt ? '● BREAK IT: ON' : '○ BREAK IT'}
                {!hasBug && <span style={{ opacity: 0.4, marginLeft: 4 }}>—</span>}
              </button>
            </div>
          </div>

          {/* Platform info bar */}
          <div style={{
            padding: '7px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: '#080810',
            flexShrink: 0,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: 12, flex: 1 }}>
              <InfoChip label="Platform" value={device?.platform} />
              <InfoChip label="Input" value={device?.inputModel === 'dpad' ? 'D-pad' : device?.inputModel === 'touch' ? 'Touch' : 'Mouse + KB'} />
              <InfoChip label="Viewport" value={`${device?.viewport.width}×${device?.viewport.height}`} />
              {device?.category === 'ctv' && (
                <InfoChip label="Safe Area" value={`${device?.safeAreaInset.top}/${device?.safeAreaInset.right}/${device?.safeAreaInset.bottom}/${device?.safeAreaInset.left}px`} accent />
              )}
              {device?.category === 'mobile' && (
                <InfoChip label="Safe Area" value={`top:${device?.safeAreaInset.top} bottom:${device?.safeAreaInset.bottom}px`} accent />
              )}
            </div>
          </div>

          {/* Main viewer area */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            padding: '12px 16px 0',
            gap: 12,
          }}>
            {/* Device frame — takes up available space */}
            <DeviceFrame
              device={device}
              config={config}
              focusIndex={focusIndex}
              breakItMode={breakIt}
              onActivate={handleActivate}
              activated={activated}
            />

            {/* Revenue impact line */}
            <RevenueLine device={device} breakItMode={breakIt} />

            {/* Remote / hints + render notes */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: 16,
              flexShrink: 0,
              paddingBottom: 12,
            }}>
              {device?.inputModel === 'dpad' && (
                <DpadRemote onNav={handleNav} device={device} breakItMode={breakIt} />
              )}
              {device?.inputModel === 'touch' && (
                <TouchHint device={device} />
              )}
              {device?.inputModel === 'cursor' && (
                <CursorHint device={device} />
              )}

              {/* Render notes */}
              <div style={{
                maxWidth: 380,
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                color: 'rgba(255,255,255,0.38)',
                lineHeight: 1.65,
              }}>
                <div style={{
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.22)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                  Platform Notes
                </div>
                {device?.renderNotes}
                {breakIt && device?.breakItBug && (
                  <div style={{
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px solid rgba(255, 77, 0, 0.25)',
                    color: '#FF4D00',
                    lineHeight: 1.5,
                    opacity: 0.85,
                  }}>
                    <strong>Bug active —</strong> {device.breakItBug.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoChip({ label, value, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)' }}>
      <span style={{ fontSize: '0.5625rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <span style={{
        fontSize: '0.6875rem',
        color: accent ? '#FF4D00' : 'rgba(255,255,255,0.45)',
      }}>
        {value}
      </span>
    </div>
  )
}
