import { useState, useEffect, useRef } from 'react';
import { useRarity } from '../context/RarityContext';
import { questions, formatRarity, getComparison, TOTAL_POPULATION } from '../data/questions';

const TOTAL_DOTS = 10000;
const GRID_SIZE = 100;

function DotMatrix({ ratio }: { ratio: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = Math.max(1, Math.round(ratio * TOTAL_DOTS));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dot = canvas.width / GRID_SIZE;
    const gap = dot * 0.2;
    const size = dot - gap;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < TOTAL_DOTS; i++) {
      const x = (i % GRID_SIZE) * dot + gap / 2;
      const y = Math.floor(i / GRID_SIZE) * dot + gap / 2;
      ctx.fillStyle = i < active ? '#0047FF' : '#0F0F0F';
      ctx.globalAlpha = i < active ? 1 : 0.1;
      ctx.fillRect(x, y, size, size);
    }
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      style={{ width: '100%', maxWidth: '320px', aspectRatio: '1' }}
    />
  );
}

export default function RarityApp() {
  const [started, setStarted] = useState(false);
  const { state, answerQuestion, reset } = useRarity();
  const question = questions[state.currentQuestionIndex] || null;
  const ratio = state.currentPool / TOTAL_POPULATION;
  const oneInX = Math.round(TOTAL_POPULATION / Math.max(state.currentPool, 1));

  const styles = {
    page: { backgroundColor: '#D1D1D1', minHeight: '100vh', fontFamily: "'Space Grotesk', system-ui, sans-serif" },
    mono: { fontFamily: "'IBM Plex Mono', monospace" },
    header: { padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    link: { fontSize: '12px', color: '#6E6E6E', textDecoration: 'none' },
    center: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '24px', flex: 1 },
    title: { fontSize: '32px', fontWeight: 700, color: '#0F0F0F', marginBottom: '8px', letterSpacing: '-0.02em' },
    subtitle: { fontSize: '14px', color: '#6E6E6E', marginBottom: '32px' },
    label: { fontSize: '11px', color: '#6E6E6E', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '4px' },
    number: { fontSize: '28px', fontWeight: 700, color: '#0F0F0F' },
    btn: { padding: '16px 48px', fontSize: '16px', fontWeight: 600, backgroundColor: '#0047FF', color: '#D1D1D1', border: 'none', cursor: 'pointer' },
    btnDark: { padding: '16px 32px', fontSize: '14px', fontWeight: 600, backgroundColor: '#0F0F0F', color: '#D1D1D1', border: 'none', cursor: 'pointer' },
    btnOutline: { padding: '16px 32px', fontSize: '14px', fontWeight: 600, backgroundColor: 'transparent', color: '#0F0F0F', border: '1px solid #0F0F0F', cursor: 'pointer', textDecoration: 'none' },
    choice: { width: '100%', padding: '16px 20px', fontSize: '15px', backgroundColor: '#FFF', border: '1px solid #0F0F0F', color: '#0F0F0F', cursor: 'pointer', textAlign: 'left' as const, marginBottom: '8px' },
  };

  // START
  if (!started) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <a href="../../" style={styles.link}>← PUBLICWORKS</a>
        </header>
        <div style={{ ...styles.center, minHeight: 'calc(100vh - 80px)' }}>
          <h1 style={styles.title}>THE RARITY ENGINE</h1>
          <p style={styles.subtitle}>How rare are you?</p>
          <div style={{ marginBottom: '32px' }}>
            <DotMatrix ratio={1} />
          </div>
          <p style={{ ...styles.mono, ...styles.label }}>World Population</p>
          <p style={{ ...styles.mono, ...styles.number, marginBottom: '32px' }}>8,000,000,000</p>
          <button style={styles.btn} onClick={() => setStarted(true)}>Start</button>
          <p style={{ ...styles.mono, fontSize: '12px', color: '#6E6E6E', marginTop: '16px' }}>25 questions</p>
        </div>
      </div>
    );
  }

  // RESULT
  if (state.isComplete) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <a href="../../" style={styles.link}>← PUBLICWORKS</a>
        </header>
        <div style={{ ...styles.center, minHeight: 'calc(100vh - 80px)' }}>
          <p style={{ ...styles.mono, ...styles.label, marginBottom: '8px' }}>You are</p>
          <h1 style={{ ...styles.title, fontSize: '40px', color: '#0047FF', marginBottom: '24px' }}>
            {formatRarity(state.currentPool)}
          </h1>
          <div style={{ marginBottom: '24px' }}>
            <DotMatrix ratio={ratio} />
          </div>
          <p style={{ fontSize: '16px', color: '#0F0F0F', marginBottom: '8px' }}>
            Rarer than <span style={{ color: '#FF4D00', fontWeight: 700 }}>{getComparison(oneInX)}</span>
          </p>
          <p style={{ ...styles.mono, fontSize: '13px', color: '#6E6E6E', marginBottom: '32px' }}>
            {state.currentPool.toLocaleString()} people like you
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button style={styles.btnDark} onClick={() => { reset(); setStarted(false); }}>Try Again</button>
            <a href="../../" style={styles.btnOutline}>Home</a>
          </div>
        </div>
      </div>
    );
  }

  // QUESTION
  return (
    <div style={{ ...styles.page, display: 'flex', flexDirection: 'column' }}>
      <header style={styles.header}>
        <a href="../../" style={styles.link}>← PUBLICWORKS</a>
        <span style={{ ...styles.mono, fontSize: '12px', color: '#6E6E6E' }}>
          {state.currentQuestionIndex + 1}/25
        </span>
      </header>

      <div style={{ ...styles.center, flex: 1, paddingBottom: '100px' }}>
        <div style={{ marginBottom: '24px' }}>
          <DotMatrix ratio={ratio} />
        </div>

        <p style={{ ...styles.mono, ...styles.label }}>People like you</p>
        <p style={{ ...styles.mono, ...styles.number, marginBottom: '32px' }}>
          {state.currentPool.toLocaleString()}
        </p>

        {question && (
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F0F0F', marginBottom: '8px', textAlign: 'center' }}>
              {question.question}
            </h2>
            {question.subtext && (
              <p style={{ ...styles.mono, fontSize: '12px', color: '#6E6E6E', marginBottom: '24px', textAlign: 'center' }}>
                {question.subtext}
              </p>
            )}
            <div>
              {question.choices.map((c) => (
                <button
                  key={c.id}
                  style={styles.choice}
                  onClick={() => answerQuestion({ questionId: question.id, choiceId: c.id, weight: c.weight })}
                  onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#0047FF'; e.currentTarget.style.color = '#FFF'; e.currentTarget.style.borderColor = '#0047FF'; }}
                  onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFF'; e.currentTarget.style.color = '#0F0F0F'; e.currentTarget.style.borderColor = '#0F0F0F'; }}
                >
                  {c.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '24px', backgroundColor: '#D1D1D1' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', height: '3px', backgroundColor: 'rgba(15,15,15,0.1)' }}>
          <div style={{ height: '100%', width: `${(state.currentQuestionIndex / 25) * 100}%`, backgroundColor: '#0047FF', transition: 'width 0.3s' }} />
        </div>
      </div>
    </div>
  );
}
