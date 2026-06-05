import React from 'react'

// Renders the paywall at the device's native resolution.
// DeviceFrame applies transform: scale() to fit the preview pane.
// Every pixel value here is a real device pixel.

export default function PaywallContent({
  config,
  device,
  focusIndex,
  breakItMode,
  onActivate,
  activated,
}) {
  const { uiScale, safeAreaInset, viewport, inputModel, breakItBug } = device
  const isBreaking = breakItMode && !!breakItBug

  const s = v => Math.round(v * uiScale)

  const focusables = config.showSecondary ? ['cta', 'secondary'] : ['cta']
  const focusedId = focusables[focusIndex] ?? 'cta'

  const isDpad = inputModel === 'dpad'
  const bugType = isBreaking ? breakItBug?.type : null

  const missingFocus    = bugType === 'missing-focus'
  const noFocusVisible  = bugType === 'no-focus-visible'
  const noTabindex      = bugType === 'no-tabindex'
  const isFocusTrap     = bugType === 'focus-trap'
  const isImageFail     = bugType === 'image-fail'
  const isSafeAreaOverflow = bugType === 'safe-area-overflow'
  const isSafeAreaHidden   = bugType === 'safe-area-hidden'
  const isAndroidSafeArea  = bugType === 'android-safe-area'
  const isCssQuirk      = bugType === 'css-quirk'
  const isTinyFont      = bugType === 'tiny-font'
  const isOverflowClip  = bugType === 'overflow-clip'
  const isCookieBanner  = bugType === 'cookie-banner'
  const isCspBlocked    = bugType === 'csp-blocked'

  // For tiny-font bug: pretend uiScale is near-zero
  const effectiveScale = isTinyFont ? uiScale * 0.18 : uiScale
  const sf = v => Math.round(v * effectiveScale)

  const focusRingFor = id => {
    if (!isDpad) return {}
    const isFocused = focusedId === id
    // All these bugs suppress the focus ring
    if (!isFocused || missingFocus || noFocusVisible || noTabindex) return {}
    // overflow-clip: use outline so it can be clipped by overflow:hidden
    if (isOverflowClip) {
      return {
        outline: `${s(4)}px solid rgba(255,255,255,0.9)`,
        outlineOffset: `${s(3)}px`,
      }
    }
    const base = {
      boxShadow: `0 0 0 ${s(4)}px rgba(255,255,255,0.9), 0 0 0 ${s(8)}px ${config.accentColor}88`,
      transition: 'box-shadow 0.15s ease, transform 0.15s ease',
    }
    if (device.id === 'apple-tv' && isFocused) {
      base.transform = 'scale(1.08)'
    }
    return base
  }

  // Vizio: push CTA below safe area bottom so it's in the overscan zone
  const ctaBugOffset = isSafeAreaOverflow ? { marginTop: s(80) } : {}

  // iOS/Android: shift card down to overlap system UI
  const cardBugOffset = (isSafeAreaHidden || isAndroidSafeArea)
    ? { transform: `translateY(${safeAreaInset.bottom + 24}px)` }
    : {}

  const cardBackdrop = isCssQuirk
    ? { background: 'rgba(8, 8, 22, 0.96)' }
    : {
        background: 'rgba(6, 6, 18, 0.72)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
      }

  const cardWidth = device.category === 'mobile'
    ? viewport.width * 0.88
    : Math.min(viewport.width * 0.52, 920)

  // CSP-blocked: render paywall with all inline styles stripped (plain HTML look)
  if (isCspBlocked) {
    return (
      <div style={{
        width: viewport.width,
        height: viewport.height,
        position: 'relative',
        overflow: 'hidden',
        background: '#f5f5f5',
        fontFamily: 'Times New Roman, serif',
        color: '#000',
      }}>
        {/* Hero still loads (img src isn't inline style) */}
        <img
          src={config.heroImage}
          alt=""
          style={{ width: '100%', height: '40%', objectFit: 'cover', display: 'block' }}
        />
        {/* Unstyled card — no inline styles rendered */}
        <div style={{ padding: `${s(20)}px`, maxWidth: cardWidth }}>
          <p style={{ fontSize: s(11), color: '#666', marginBottom: s(8) }}>StreamBox · Premium</p>
          <h2 style={{ fontSize: s(18), marginBottom: s(8) }}>{config.headline || 'Unlimited Entertainment'}</h2>
          <p style={{ fontSize: s(13), marginBottom: s(12), color: '#444', lineHeight: 1.5 }}>
            {config.subtext || 'Stream thousands of movies, shows, and more.'}
          </p>
          <p style={{ fontSize: s(20), marginBottom: s(16) }}><strong>{config.price || '$9.99'}</strong> / {config.period || 'month'}</p>
          <button style={{ fontSize: s(14), padding: `${s(8)}px ${s(16)}px`, marginBottom: s(8), display: 'block', width: '100%' }}>
            {config.ctaLabel || 'Start Free Trial'}
          </button>
          {config.showSecondary && (
            <button style={{ fontSize: s(13), padding: `${s(6)}px ${s(16)}px`, display: 'block', width: '100%' }}>
              {config.secondaryLabel || 'Restore Purchase'}
            </button>
          )}
        </div>
        {/* CSP error bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: '#fff3cd',
          borderTop: '2px solid #ffc107',
          padding: `${s(8)}px ${s(12)}px`,
          fontSize: s(11),
          color: '#856404',
          fontFamily: 'monospace',
        }}>
          ⚠ Refused to apply inline style because it violates Content Security Policy directive: "style-src 'self'"
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: viewport.width,
        height: viewport.height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: config.bgColor,
        fontFamily: device.id === 'roku'
          ? 'Arial, Helvetica, sans-serif'
          : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Hero background */}
      {isImageFail ? (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#111128',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: s(12),
          color: '#44445a',
        }}>
          <div style={{ fontSize: s(56), lineHeight: 1 }}>⚠</div>
          <div style={{ fontSize: s(22), fontWeight: 500 }}>Image failed to load</div>
          <div style={{ fontSize: s(16), opacity: 0.6 }}>Memory budget exceeded</div>
        </div>
      ) : (
        <>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${config.heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(160deg, ${config.bgColor}e8 0%, ${config.bgColor}88 40%, ${config.bgColor}cc 100%)`,
          }} />
        </>
      )}

      {/* Content area respects safe area */}
      <div style={{
        position: 'absolute',
        top: safeAreaInset.top,
        right: safeAreaInset.right,
        bottom: safeAreaInset.bottom,
        left: safeAreaInset.left,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Glass card */}
        <div style={{
          width: cardWidth,
          borderRadius: sf(20),
          padding: `${sf(48)}px ${sf(52)}px`,
          border: isOverflowClip
            ? `${s(2)}px dashed rgba(255, 150, 50, 0.5)`
            : '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: sf(20),
          overflow: isOverflowClip ? 'hidden' : 'visible',
          position: 'relative',
          ...cardBackdrop,
          ...cardBugOffset,
        }}>
          {/* overflow-clip indicator */}
          {isOverflowClip && (
            <div style={{
              position: 'absolute',
              top: sf(8),
              right: sf(10),
              fontSize: sf(11),
              color: 'rgba(255,150,50,0.7)',
              fontFamily: 'monospace',
              letterSpacing: '0.04em',
            }}>
              overflow: hidden
            </div>
          )}

          {/* Service label */}
          <div style={{
            fontSize: sf(13),
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: config.accentColor,
            opacity: 0.9,
          }}>
            StreamBox · Premium
          </div>

          {/* Headline */}
          <div>
            <div style={{
              fontSize: sf(38),
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#fff',
              marginBottom: sf(10),
            }}>
              {config.headline || 'Unlimited Entertainment'}
            </div>
            <div style={{
              fontSize: sf(16),
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.65)',
            }}>
              {config.subtext || 'Stream thousands of movies, shows, and more.'}
            </div>
          </div>

          {/* tiny-font annotation */}
          {isTinyFont && (
            <div style={{
              padding: `${s(10)}px ${s(14)}px`,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: s(8),
              fontSize: s(13),
              color: '#fca5a5',
              lineHeight: 1.45,
            }}>
              ↑ Text above is {sf(38)}px instead of {s(38)}px — looks like {sf(38)} physical pixels on screen
            </div>
          )}

          {/* Price */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: sf(6),
            marginTop: sf(4),
          }}>
            <span style={{
              fontSize: sf(42),
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}>
              {config.price || '$9.99'}
            </span>
            <span style={{
              fontSize: sf(16),
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 400,
            }}>
              / {config.period || 'month'}
            </span>
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: 'rgba(255,255,255,0.08)',
            margin: `${sf(4)}px 0`,
          }} />

          {/* CTA Button */}
          <button
            data-focusable="cta"
            onClick={() => onActivate?.('cta')}
            style={{
              width: '100%',
              padding: `${sf(18)}px ${sf(32)}px`,
              fontSize: sf(17),
              fontWeight: 600,
              color: '#fff',
              background: config.accentColor,
              border: 'none',
              borderRadius: sf(12),
              cursor: inputModel === 'cursor' ? 'pointer' : 'default',
              outline: isOverflowClip ? undefined : 'none',
              letterSpacing: '0.01em',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              ...focusRingFor('cta'),
              ...ctaBugOffset,
            }}
          >
            {config.ctaLabel || 'Start Free Trial'}
          </button>

          {/* Secondary action */}
          {config.showSecondary && (
            <button
              data-focusable="secondary"
              onClick={() => onActivate?.('secondary')}
              style={{
                width: '100%',
                padding: `${sf(14)}px ${sf(32)}px`,
                fontSize: sf(14),
                fontWeight: 500,
                color: 'rgba(255,255,255,0.55)',
                background: 'transparent',
                border: `1px solid rgba(255,255,255,0.14)`,
                borderRadius: sf(10),
                cursor: inputModel === 'cursor' ? 'pointer' : 'default',
                outline: isOverflowClip ? undefined : 'none',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                ...(isFocusTrap ? { borderColor: 'rgba(255,255,255,0.22)' } : {}),
                ...focusRingFor('secondary'),
              }}
            >
              {config.secondaryLabel || 'Restore Purchase'}
            </button>
          )}

          {/* Focus trap warning */}
          {isFocusTrap && (
            <div style={{
              marginTop: s(8),
              padding: `${s(10)}px ${s(14)}px`,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: s(8),
              fontSize: s(12),
              color: '#fca5a5',
              lineHeight: 1.45,
            }}>
              ⚠ Focus is trapped here. "{config.ctaLabel || 'Start Free Trial'}" is unreachable from the remote.
            </div>
          )}

          {/* no-tabindex warning */}
          {noTabindex && (
            <div style={{
              marginTop: s(8),
              padding: `${s(10)}px ${s(14)}px`,
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: s(8),
              fontSize: s(12),
              color: '#fca5a5',
              lineHeight: 1.45,
            }}>
              ⚠ tabindex not set — gamepad spatial navigation graph is empty. Controller D-pad frozen.
            </div>
          )}
        </div>
      </div>

      {/* Cookie banner overlay (Chrome bug) */}
      {isCookieBanner && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(12,12,24,0.97)',
          borderTop: `${s(2)}px solid rgba(255,255,255,0.12)`,
          padding: `${s(20)}px ${s(24)}px`,
          display: 'flex',
          alignItems: 'center',
          gap: s(16),
          zIndex: 50,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: s(14), fontWeight: 600, color: '#fff', marginBottom: s(6) }}>
              🍪 We value your privacy
            </div>
            <div style={{ fontSize: s(12), color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              We use cookies to personalize content, run analytics, and improve your experience. By continuing, you agree to our Cookie Policy.
            </div>
          </div>
          <div style={{ display: 'flex', gap: s(8), flexShrink: 0 }}>
            <button style={{
              padding: `${s(10)}px ${s(16)}px`, fontSize: s(13),
              background: 'transparent', border: `1px solid rgba(255,255,255,0.2)`,
              borderRadius: s(6), color: 'rgba(255,255,255,0.55)', cursor: 'pointer',
            }}>
              Manage
            </button>
            <button style={{
              padding: `${s(10)}px ${s(20)}px`, fontSize: s(13),
              background: config.accentColor, border: 'none',
              borderRadius: s(6), color: '#fff', fontWeight: 600, cursor: 'pointer',
            }}>
              Accept All
            </button>
          </div>
        </div>
      )}

      {/* Activated confirmation overlay */}
      {activated && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.55)',
          animation: 'fadeInScale 0.2s ease both',
        }}>
          <div style={{
            textAlign: 'center',
            padding: `${s(40)}px ${s(56)}px`,
            background: config.accentColor,
            borderRadius: s(20),
            boxShadow: `0 ${s(24)}px ${s(64)}px rgba(0,0,0,0.5)`,
          }}>
            <div style={{ fontSize: s(52), marginBottom: s(12) }}>🎉</div>
            <div style={{ fontSize: s(28), fontWeight: 700, color: '#fff', marginBottom: s(8) }}>
              {activated === 'cta' ? 'Free Trial Started!' : 'Purchase Restored!'}
            </div>
            <div style={{ fontSize: s(15), color: 'rgba(255,255,255,0.75)' }}>
              {activated === 'cta' ? '7 days free, then ' + (config.price || '$9.99') + '/' + (config.period || 'month') : 'Your subscription has been restored.'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
