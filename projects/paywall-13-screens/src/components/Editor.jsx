import React, { useRef } from 'react'
import { SAMPLE_IMAGES } from '../deviceProfiles'

function Label({ children }) {
  return (
    <div style={{
      fontSize: '0.5625rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.3)',
      marginBottom: 5,
    }}>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, multiline }) {
  const style = {
    width: '100%',
    padding: '8px 10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    resize: multiline ? 'none' : undefined,
    lineHeight: 1.5,
    transition: 'border-color 0.15s ease',
  }
  return multiline
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2} style={style} onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
    : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
}

function Section({ title, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        fontSize: '0.5625rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.18)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        paddingBottom: 6,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export default function Editor({ config, onChange }) {
  const fileRef = useRef(null)

  const set = (key, val) => onChange({ ...config, [key]: val })

  const handleFileUpload = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('heroImage', ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{
      width: 288,
      minWidth: 288,
      height: '100%',
      overflowY: 'auto',
      background: '#0d0d16',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: '20px 16px',
    }}>
      <div style={{
        fontSize: '0.6875rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}>
        Design your paywall
      </div>

      {/* Hero image */}
      <Section title="Hero Image">
        <div style={{ display: 'flex', gap: 6 }}>
          {SAMPLE_IMAGES.map(img => (
            <button
              key={img.id}
              onClick={() => set('heroImage', img.url)}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 6,
                border: config.heroImage === img.url
                  ? '2px solid rgba(255,255,255,0.5)'
                  : '2px solid transparent',
                backgroundImage: `url(${img.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                position: 'relative',
              }}
              title={img.label}
            >
              {config.heroImage === img.url && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12,
                }}>✓</div>
              )}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            value={config.heroImage?.startsWith('data:') ? '(uploaded image)' : config.heroImage}
            onChange={e => set('heroImage', e.target.value)}
            placeholder="https://..."
            style={{
              flex: 1,
              padding: '7px 10px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              padding: '7px 10px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Upload
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
        </div>
      </Section>

      {/* Copy */}
      <Section title="Copy">
        <div>
          <Label>Headline</Label>
          <TextInput
            value={config.headline}
            onChange={v => set('headline', v)}
            placeholder="Unlimited Entertainment"
          />
        </div>
        <div>
          <Label>Subtext</Label>
          <TextInput
            value={config.subtext}
            onChange={v => set('subtext', v)}
            placeholder="Stream thousands of movies..."
            multiline
          />
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <Label>Price</Label>
            <TextInput value={config.price} onChange={v => set('price', v)} placeholder="$9.99" />
          </div>
          <div style={{ flex: 1 }}>
            <Label>Period</Label>
            <TextInput value={config.period} onChange={v => set('period', v)} placeholder="month" />
          </div>
        </div>
      </Section>

      {/* Actions */}
      <Section title="Buttons">
        <div>
          <Label>Primary CTA</Label>
          <TextInput
            value={config.ctaLabel}
            onChange={v => set('ctaLabel', v)}
            placeholder="Start Free Trial"
          />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <Label>Secondary Action</Label>
            <button
              onClick={() => set('showSecondary', !config.showSecondary)}
              style={{
                padding: '2px 10px',
                background: config.showSecondary ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6,
                color: config.showSecondary ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {config.showSecondary ? 'On' : 'Off'}
            </button>
          </div>
          {config.showSecondary && (
            <TextInput
              value={config.secondaryLabel}
              onChange={v => set('secondaryLabel', v)}
              placeholder="Restore Purchase"
            />
          )}
        </div>
      </Section>

      {/* Theme */}
      <Section title="Theme">
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Label>Background</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={config.bgColor}
                onChange={e => set('bgColor', e.target.value)}
                style={{ width: 32, height: 32 }}
              />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                {config.bgColor}
              </span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Label>Accent</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="color"
                value={config.accentColor}
                onChange={e => set('accentColor', e.target.value)}
                style={{ width: 32, height: 32 }}
              />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                {config.accentColor}
              </span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
