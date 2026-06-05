import React, { useRef, useState, useEffect } from 'react'
import PaywallContent from './PaywallContent'

// Bezel padding (in preview px, not device px) for each type
const BEZEL = {
  'tv': { top: 10, right: 12, bottom: 52, left: 12, radius: 10 },
  'phone-ios': { top: 68, right: 14, bottom: 64, left: 14, radius: 52 },
  'phone-android': { top: 54, right: 12, bottom: 52, left: 12, radius: 40 },
  'browser-chrome': { top: 78, right: 0, bottom: 0, left: 0, radius: 10 },
  'browser-safari': { top: 66, right: 0, bottom: 0, left: 0, radius: 10 },
  'browser-edge': { top: 78, right: 0, bottom: 0, left: 0, radius: 10 },
}

function SafeAreaGuide({ inset, category }) {
  const { top, right, bottom, left } = inset
  if (!top && !right && !bottom && !left) return null

  const dangerColor = category === 'mobile'
    ? 'rgba(255, 150, 50, 0.18)'
    : 'rgba(255, 80, 60, 0.12)'
  const borderColor = category === 'mobile'
    ? 'rgba(255, 150, 50, 0.4)'
    : 'rgba(255, 200, 60, 0.32)'
  const labelColor = category === 'mobile'
    ? 'rgba(255, 150, 50, 0.65)'
    : 'rgba(255, 200, 60, 0.55)'

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20 }}>
      {/* Danger-zone overlays at each edge */}
      {top    > 0 && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: top, background: dangerColor }} />}
      {bottom > 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: bottom, background: dangerColor }} />}
      {left   > 0 && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: left, background: dangerColor }} />}
      {right  > 0 && <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: right, background: dangerColor }} />}
      {/* Safe-area boundary */}
      <div style={{
        position: 'absolute',
        top, right, bottom, left,
        border: `1px dashed ${borderColor}`,
        borderRadius: 4,
      }} />
      {/* Label */}
      <div style={{
        position: 'absolute',
        top: top + 6,
        left: left + 8,
        fontSize: category === 'ctv' ? 12 : 10,
        color: labelColor,
        fontFamily: 'monospace',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}>
        {category === 'ctv' ? 'safe area' : category === 'mobile' ? 'system UI' : ''}
      </div>
    </div>
  )
}

// ── Bezel components ────────────────────────────────────────────────────────

function TVBezel({ screenW, screenH, children }) {
  const b = BEZEL['tv']
  const outerW = screenW + b.left + b.right
  const outerH = screenH + b.top + b.bottom
  return (
    <div style={{
      position: 'relative',
      width: outerW,
      height: outerH,
      background: 'linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 100%)',
      borderRadius: b.radius,
      boxShadow: '0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Screen */}
      <div style={{
        position: 'absolute',
        top: b.top,
        left: b.left,
        width: screenW,
        height: screenH,
        background: '#000',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.8)',
      }}>
        {children}
      </div>
      {/* Stand */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: screenW * 0.22,
        height: 38,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ width: '40%', height: 14, background: '#222226', borderRadius: '0 0 4px 4px' }} />
        <div style={{ width: '100%', height: 8, background: '#28282c', borderRadius: '0 0 6px 6px', marginTop: 0 }} />
      </div>
      {/* Power LED */}
      <div style={{
        position: 'absolute',
        bottom: 44,
        right: b.right + 8,
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: '#22d3a0',
        boxShadow: '0 0 6px #22d3a0',
      }} />
    </div>
  )
}

function PhoneBezel({ screenW, screenH, isIOS, children }) {
  const key = isIOS ? 'phone-ios' : 'phone-android'
  const b = BEZEL[key]
  const outerW = screenW + b.left + b.right
  const outerH = screenH + b.top + b.bottom
  const r = b.radius

  return (
    <div style={{
      position: 'relative',
      width: outerW,
      height: outerH,
      background: isIOS
        ? 'linear-gradient(160deg, #222224 0%, #141416 100%)'
        : 'linear-gradient(160deg, #1e2024 0%, #14151a 100%)',
      borderRadius: r,
      boxShadow: '0 20px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      {/* Screen cutout */}
      <div style={{
        position: 'absolute',
        top: b.top,
        left: b.left,
        width: screenW,
        height: screenH,
        background: '#000',
        overflow: 'hidden',
        borderRadius: isIOS ? 4 : 2,
      }}>
        {children}
      </div>

      {/* iOS: Dynamic Island */}
      {isIOS && (
        <div style={{
          position: 'absolute',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 126,
          height: 36,
          background: '#000',
          borderRadius: 20,
          zIndex: 10,
        }} />
      )}

      {/* Android: punch-hole camera */}
      {!isIOS && (
        <div style={{
          position: 'absolute',
          top: 22,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 14,
          height: 14,
          background: '#050507',
          borderRadius: '50%',
          zIndex: 10,
          border: '1.5px solid #1c1c20',
        }} />
      )}

      {/* iOS: home indicator */}
      {isIOS && (
        <div style={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 130,
          height: 5,
          background: 'rgba(255,255,255,0.35)',
          borderRadius: 3,
          zIndex: 10,
        }} />
      )}

      {/* Android: gesture bar */}
      {!isIOS && (
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 100,
          height: 4,
          background: 'rgba(255,255,255,0.25)',
          borderRadius: 2,
          zIndex: 10,
        }} />
      )}

      {/* Side buttons */}
      {isIOS && (
        <>
          <div style={{ position: 'absolute', right: -3, top: 80, width: 4, height: 32, background: '#333', borderRadius: '0 3px 3px 0' }} />
          <div style={{ position: 'absolute', left: -3, top: 72, width: 4, height: 28, background: '#333', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3, top: 112, width: 4, height: 56, background: '#333', borderRadius: '3px 0 0 3px' }} />
          <div style={{ position: 'absolute', left: -3, top: 178, width: 4, height: 56, background: '#333', borderRadius: '3px 0 0 3px' }} />
        </>
      )}
    </div>
  )
}

function BrowserBezel({ screenW, screenH, type, children }) {
  const b = BEZEL[`browser-${type}`]
  const outerW = screenW
  const outerH = screenH + b.top

  const colors = {
    chrome: { frame: '#2c2c30', tab: '#3c3c40', url: '#1a1a1e', icon: '#4285F4' },
    safari: { frame: '#282828', tab: '#323232', url: '#1e1e1e', icon: '#006FFF' },
    edge:   { frame: '#2a2a30', tab: '#34343a', url: '#1c1c22', icon: '#0078d4' },
  }
  const c = colors[type] || colors.chrome

  const icons = {
    chrome: (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7.5" fill="#fff" stroke="#ddd" strokeWidth="0.5"/>
        <circle cx="8" cy="8" r="3" fill="#4285F4"/>
        <path d="M8 4.5h5.3" stroke="#FBBC05" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M11 12.1L8.35 7.5" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M2.65 7.5L5.3 12.1" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    safari: (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" fill="#006FFF"/>
        <circle cx="8" cy="8" r="5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
        <line x1="8" y1="3" x2="8" y2="13" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
        <line x1="3" y1="8" x2="13" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
        <path d="M10.5 5.5L7.2 8.8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7.2 8.8L5.5 10.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    edge: (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" fill="#0078d4"/>
        <path d="M4 9.5C4 6 8.5 3 11 5c1 1 0 3.5-2 3.5H4z" fill="#50e6ff" opacity="0.8"/>
        <path d="M3 11.5c1.5 1.5 9 2 10-1-2 2.5-8 2-10 1z" fill="white" opacity="0.7"/>
      </svg>
    ),
  }

  return (
    <div style={{
      position: 'relative',
      width: outerW,
      height: outerH,
      background: c.frame,
      borderRadius: b.radius,
      boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
      overflow: 'hidden',
    }}>
      {/* Window controls + title bar */}
      <div style={{
        height: 32,
        background: c.frame,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 12,
        gap: 7,
        flexShrink: 0,
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
      </div>

      {/* Tab bar */}
      <div style={{
        height: type === 'safari' ? 0 : 30,
        background: c.frame,
        display: 'flex',
        alignItems: 'flex-end',
        paddingLeft: 72,
        overflow: 'hidden',
      }}>
        {type !== 'safari' && (
          <div style={{
            padding: '5px 16px',
            background: c.tab,
            borderRadius: '6px 6px 0 0',
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            maxWidth: 180,
          }}>
            {icons[type]}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              StreamBox Premium
            </span>
          </div>
        )}
      </div>

      {/* Address bar */}
      <div style={{
        height: type === 'safari' ? 34 : 34,
        background: c.tab,
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 10,
      }}>
        {/* Back/forward */}
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, cursor: 'default' }}>‹</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, cursor: 'default' }}>›</span>
        </div>
        {/* URL bar */}
        <div style={{
          flex: 1,
          height: 22,
          background: c.url,
          borderRadius: 5,
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          gap: 5,
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
        }}>
          <span style={{ color: '#22c55e', fontSize: 11 }}>🔒</span>
          <span>streambox.com/subscribe</span>
        </div>
        {type === 'safari' && (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>⊕</div>
        )}
      </div>

      {/* Screen */}
      <div style={{
        width: screenW,
        height: screenH,
        background: '#000',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  )
}

// ── Main DeviceFrame ─────────────────────────────────────────────────────────

export default function DeviceFrame({
  device,
  config,
  focusIndex,
  breakItMode,
  onActivate,
  activated,
}) {
  const containerRef = useRef(null)
  const [containerSize, setContainerSize] = useState({ w: 800, h: 500 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { viewport, bezelType, safeAreaInset } = device
  const b = BEZEL[bezelType] || BEZEL['tv']

  // Available space minus bezel chrome (in preview px)
  const isBrowser = bezelType.startsWith('browser')
  const isPhone = bezelType.startsWith('phone')

  const availW = containerSize.w - b.left - b.right - (isBrowser ? 0 : 8)
  const availH = containerSize.h - b.top - b.bottom - (isBrowser ? 0 : 8)

  const scaleX = availW / viewport.width
  const scaleY = availH / viewport.height
  const rawScale = Math.min(scaleX, scaleY) * 0.88

  // Phones get a slight size boost since they're narrow
  const scale = isPhone ? rawScale * 1.05 : rawScale

  const screenW = Math.round(viewport.width * scale)
  const screenH = Math.round(viewport.height * scale)

  const renderBezel = () => {
    const inner = (
      <div style={{ position: 'relative', width: screenW, height: screenH }}>
        {/* Scaled paywall at native resolution */}
        <div style={{
          width: viewport.width,
          height: viewport.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
          <PaywallContent
            config={config}
            device={device}
            focusIndex={focusIndex}
            breakItMode={breakItMode}
            onActivate={onActivate}
            activated={activated}
          />
          <SafeAreaGuide inset={safeAreaInset} category={device.category} />
        </div>
      </div>
    )

    switch (bezelType) {
      case 'tv':
        return <TVBezel screenW={screenW} screenH={screenH}>{inner}</TVBezel>
      case 'phone-ios':
        return <PhoneBezel screenW={screenW} screenH={screenH} isIOS>{inner}</PhoneBezel>
      case 'phone-android':
        return <PhoneBezel screenW={screenW} screenH={screenH}>{inner}</PhoneBezel>
      case 'browser-chrome':
        return <BrowserBezel screenW={screenW} screenH={screenH} type="chrome">{inner}</BrowserBezel>
      case 'browser-safari':
        return <BrowserBezel screenW={screenW} screenH={screenH} type="safari">{inner}</BrowserBezel>
      case 'browser-edge':
        return <BrowserBezel screenW={screenW} screenH={screenH} type="edge">{inner}</BrowserBezel>
      default:
        return <TVBezel screenW={screenW} screenH={screenH}>{inner}</TVBezel>
    }
  }

  return (
    <>
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        minHeight: 0,
      }}
    >
      <div className="animate-fadeInScale device-transition" style={{ position: 'relative' }}>
        {renderBezel()}
      </div>
    </div>

    {/* Break-it bug label — outside overflow:hidden so it renders in flow */}
    {breakItMode && device.breakItBug && (
      <div style={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        padding: '4px 16px',
      }}>
        <div style={{
          background: 'rgba(255, 77, 0, 0.1)',
          border: '1px solid rgba(255, 77, 0, 0.35)',
          borderRadius: 0,
          padding: '5px 12px',
          fontSize: '0.625rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.04em',
          color: '#FF4D00',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          maxWidth: '90vw',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ opacity: 0.8 }}>●</span>
          {device.breakItBug.label}
        </div>
      </div>
    )}
    </>
  )
}
