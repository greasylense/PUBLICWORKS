import { useState, useEffect, useRef } from 'react';
import { useRarity } from '../context/RarityContext';
import { questions, formatRarity, getComparison, TOTAL_POPULATION } from '../data/questions';

const TOTAL_DOTS = 10000;
const GRID_COLS = 100;

// Canvas-based dot matrix for 10,000 dots
function DotMatrix({ activeRatio }: { activeRatio: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeDots = Math.max(1, Math.round(activeRatio * TOTAL_DOTS));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const dotSize = size / GRID_COLS;
    const gap = dotSize * 0.15;
    const actualDotSize = dotSize - gap;

    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < TOTAL_DOTS; i++) {
      const row = Math.floor(i / GRID_COLS);
      const col = i % GRID_COLS;
      const x = col * dotSize + gap / 2;
      const y = row * dotSize + gap / 2;

      const isActive = i < activeDots;

      if (isActive) {
        ctx.fillStyle = '#0047FF';
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = '#0F0F0F';
        ctx.globalAlpha = 0.08;
      }

      ctx.fillRect(x, y, actualDotSize, actualDotSize);
    }
  }, [activeDots]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      style={{
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        aspectRatio: '1',
      }}
    />
  );
}

// Home link component - use relative path for GitHub Pages
function HomeLink() {
  return (
    <a
      href="../../"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '12px',
        color: '#6E6E6E',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'color 0.15s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = '#0047FF'}
      onMouseLeave={(e) => e.currentTarget.style.color = '#6E6E6E'}
    >
      <span style={{ fontSize: '16px' }}>&larr;</span> PUBLICWORKS
    </a>
  );
}

export default function RarityApp() {
  const [started, setStarted] = useState(false);
  const { state, answerQuestion, reset } = useRarity();

  const currentQuestion = state.currentQuestionIndex < questions.length
    ? questions[state.currentQuestionIndex]
    : null;

  const oneInX = Math.round(TOTAL_POPULATION / Math.max(state.currentPool, 1));
  const progress = (state.currentQuestionIndex / 25) * 100;
  const activeRatio = state.currentPool / TOTAL_POPULATION;

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#D1D1D1' }}>
        <header className="p-6">
          <HomeLink />
        </header>

        <main className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="text-center w-full max-w-lg">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                color: '#0F0F0F',
              }}
            >
              THE RARITY ENGINE
            </h1>
            <p className="text-base mb-8" style={{ color: '#6E6E6E' }}>
              Discover how rare you really are
            </p>

            <div className="mb-8">
              <DotMatrix activeRatio={1} />
            </div>

            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#6E6E6E',
              }}
            >
              Starting population
            </p>
            <p
              className="text-3xl font-bold mb-10"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#0F0F0F',
              }}
            >
              8,000,000,000
            </p>

            <button
              onClick={() => setStarted(true)}
              className="px-12 py-4 font-semibold text-lg transition-all duration-200"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                backgroundColor: '#0047FF',
                color: '#D1D1D1',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0035CC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0047FF'}
            >
              Begin
            </button>

            <p
              className="mt-6 text-sm"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#6E6E6E',
              }}
            >
              25 questions &middot; 2 min
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Result screen
  if (state.isComplete) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#D1D1D1' }}>
        <header className="p-6">
          <HomeLink />
        </header>

        <main className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="text-center w-full max-w-lg">
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#6E6E6E',
              }}
            >
              Out of 8 billion people, you are
            </p>
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                color: '#0047FF',
              }}
            >
              {formatRarity(state.currentPool)}
            </h1>

            <div className="mb-8">
              <DotMatrix activeRatio={activeRatio} />
            </div>

            <p
              className="text-lg mb-2"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                color: '#0F0F0F',
              }}
            >
              Rarer than{' '}
              <span className="font-bold" style={{ color: '#FF4D00' }}>
                {getComparison(oneInX)}
              </span>
            </p>

            <p
              className="text-sm mb-10"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#6E6E6E',
              }}
            >
              Only {state.currentPool.toLocaleString()} people share your combination
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  reset();
                  setStarted(false);
                }}
                className="px-10 py-4 font-semibold transition-all duration-200"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  backgroundColor: '#0F0F0F',
                  color: '#D1D1D1',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0F0F0F'}
              >
                Try Again
              </button>
              <a
                href="../../"
                className="px-10 py-4 font-semibold transition-all duration-200 text-center"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  backgroundColor: 'transparent',
                  color: '#0F0F0F',
                  border: '1px solid #0F0F0F',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0F0F0F';
                  e.currentTarget.style.color = '#D1D1D1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#0F0F0F';
                }}
              >
                Back to Home
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Question screen
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#D1D1D1' }}>
      <header className="p-6 flex items-center justify-between">
        <HomeLink />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            color: '#6E6E6E',
          }}
        >
          {state.currentQuestionIndex + 1} / 25
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Dot matrix at top */}
        <div className="w-full max-w-md mb-8">
          <DotMatrix activeRatio={activeRatio} />
        </div>

        {/* Population counter */}
        <div className="text-center mb-8">
          <p
            className="text-xs uppercase tracking-wider mb-1"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#6E6E6E',
            }}
          >
            People like you
          </p>
          <p
            className="text-3xl font-bold"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#0F0F0F',
            }}
          >
            {state.currentPool.toLocaleString()}
          </p>
        </div>

        {/* Question card */}
        {currentQuestion && (
          <div className="w-full max-w-md">
            <h2
              className="text-xl md:text-2xl font-bold mb-3 text-center"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                color: '#0F0F0F',
              }}
            >
              {currentQuestion.question}
            </h2>

            {currentQuestion.subtext && (
              <p
                className="text-sm mb-6 text-center"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#6E6E6E',
                }}
              >
                {currentQuestion.subtext}
              </p>
            )}

            <div className="space-y-3 mt-6">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => answerQuestion({
                    questionId: currentQuestion.id,
                    choiceId: choice.id,
                    weight: choice.weight,
                  })}
                  className="w-full text-left px-5 py-4 transition-all duration-150"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #0F0F0F',
                    color: '#0F0F0F',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0047FF';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#0047FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#0F0F0F';
                    e.currentTarget.style.borderColor = '#0F0F0F';
                  }}
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Progress bar at bottom */}
      <footer className="p-6">
        <div className="max-w-md mx-auto">
          <div style={{ height: '3px', backgroundColor: '#0F0F0F', opacity: 0.15 }}>
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                backgroundColor: '#0047FF',
              }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
