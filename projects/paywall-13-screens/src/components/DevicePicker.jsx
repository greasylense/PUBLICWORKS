import React, { useState } from 'react'
import { DEVICES_BY_CATEGORY } from '../deviceProfiles'

const DEVICE_ICONS = {
  'apple-tv':  '🍎',
  'roku':      '📺',
  'fire-tv':   '🔥',
  'google-tv': '🎬',
  'samsung':   '📟',
  'lg':        '📡',
  'vizio':     '🖥',
  'xbox':      '🎮',
  'ios':       '📱',
  'android':   '🤖',
  'chrome':    '🌐',
  'safari':    '🧭',
  'edge':      '🔷',
}

const CATEGORY_LABELS = { ctv: 'Smart TV / CTV', mobile: 'Mobile', web: 'Web Browser' }

export default function DevicePicker({ activeId, onSelect }) {
  const [activeCategory, setActiveCategory] = useState(
    DEVICES_BY_CATEGORY.ctv.some(d => d.id === activeId) ? 'ctv' :
    DEVICES_BY_CATEGORY.mobile.some(d => d.id === activeId) ? 'mobile' : 'web'
  )

  const handleSelect = id => {
    onSelect(id)
    // Keep category in sync when selecting from outside
  }

  const devices = DEVICES_BY_CATEGORY[activeCategory] || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 4 }}>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => {
              setActiveCategory(key)
              const inCategory = DEVICES_BY_CATEGORY[key].some(d => d.id === activeId)
              if (!inCategory) {
                handleSelect(DEVICES_BY_CATEGORY[key][0].id)
              }
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.5625rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: 0,
              border: activeCategory === key
                ? '1px solid rgba(255,255,255,0.2)'
                : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: activeCategory === key
                ? 'rgba(255,255,255,0.08)'
                : 'transparent',
              color: activeCategory === key
                ? 'rgba(255,255,255,0.85)'
                : 'rgba(255,255,255,0.3)',
            }}
          >
            {key === 'ctv' ? 'CTV' : key === 'mobile' ? 'Mobile' : 'Web'}
          </button>
        ))}
      </div>

      {/* Device pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {devices.map(device => {
          const isActive = device.id === activeId
          const hasBug = !!device.breakItBug
          return (
            <button
              key={device.id}
              onClick={() => handleSelect(device.id)}
              title={device.platform}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 0,
                border: isActive
                  ? '1px solid rgba(255,255,255,0.22)'
                  : '1px solid rgba(255,255,255,0.06)',
                background: isActive
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent',
                color: isActive
                  ? 'rgba(255,255,255,0.92)'
                  : 'rgba(255,255,255,0.4)',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: isActive ? 500 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                letterSpacing: '-0.01em',
              }}
            >
              <span style={{ fontSize: 12, lineHeight: 1 }}>{DEVICE_ICONS[device.id] || '📺'}</span>
              <span>{device.displayName}</span>
              {hasBug && (
                <span
                  title="Has a Break It bug"
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: '#FF4D00',
                    opacity: 0.75,
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
