import { useState } from 'react';
import { useRarity } from '../context/RarityContext';
import { questions, formatRarity, getComparison, TOTAL_POPULATION } from '../data/questions';

export default function RarityApp() {
  const [started, setStarted] = useState(false);
  const { state, answerQuestion, reset } = useRarity();

  const currentQuestion = state.currentQuestionIndex < questions.length
    ? questions[state.currentQuestionIndex]
    : null;

  const oneInX = Math.round(TOTAL_POPULATION / Math.max(state.currentPool, 1));
  const progress = (state.currentQuestionIndex / 25) * 100;

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#D1D1D1' }}>
        <div className="text-center max-w-md">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              color: '#0F0F0F',
            }}
          >
            THE RARITY ENGINE
          </h1>
          <p className="text-lg mb-2" style={{ color: '#6E6E6E' }}>
            Discover how rare you really are
          </p>
          <p className="text-sm mb-8" style={{ color: '#6E6E6E' }}>
            Answer 25 questions. Watch 8 billion become one.
          </p>

          <div
            className="px-6 py-4 mb-8 inline-block"
            style={{
              backgroundColor: '#0F0F0F',
            }}
          >
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
              className="text-3xl font-bold"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#D1D1D1',
              }}
            >
              8,000,000,000
            </p>
          </div>

          <div>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-4 font-semibold text-lg transition-all duration-200 hover:translate-x-1"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                backgroundColor: '#0047FF',
                color: '#D1D1D1',
              }}
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Result screen
  if (state.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#D1D1D1' }}>
        <div className="text-center max-w-md">
          <p
            className="text-sm uppercase tracking-widest mb-4"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#6E6E6E',
            }}
          >
            You are
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
          <p className="text-xl mb-8" style={{ color: '#0F0F0F' }}>
            Rarer than{' '}
            <span className="font-semibold" style={{ color: '#FF4D00' }}>
              {getComparison(oneInX)}
            </span>
          </p>

          <div
            className="px-6 py-4 mb-8 inline-block"
            style={{ backgroundColor: '#0F0F0F' }}
          >
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
              className="text-2xl font-bold"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: '#D1D1D1',
              }}
            >
              {state.currentPool.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                reset();
                setStarted(false);
              }}
              className="px-8 py-4 font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
                backgroundColor: '#0F0F0F',
                color: '#D1D1D1',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#D1D1D1' }}>
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 pb-32">
        {currentQuestion && (
          <div className="w-full max-w-lg">
            <div
              className="p-6 md:p-8"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #0F0F0F',
              }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-4"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: '#6E6E6E',
                }}
              >
                Question {state.currentQuestionIndex + 1} of 25
              </p>

              <h2
                className="text-xl md:text-2xl font-bold mb-2"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  color: '#0F0F0F',
                }}
              >
                {currentQuestion.question}
              </h2>

              {currentQuestion.subtext && (
                <p
                  className="text-sm mb-6"
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
                      backgroundColor: '#D1D1D1',
                      border: '1px solid #0F0F0F',
                      color: '#0F0F0F',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0047FF';
                      e.currentTarget.style.color = '#D1D1D1';
                      e.currentTarget.style.borderColor = '#0047FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#D1D1D1';
                      e.currentTarget.style.color = '#0F0F0F';
                      e.currentTarget.style.borderColor = '#0F0F0F';
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0"
        style={{
          backgroundColor: '#0F0F0F',
        }}
      >
        {/* Progress bar */}
        <div style={{ height: '3px', backgroundColor: '#6E6E6E' }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: '#0047FF',
            }}
          />
        </div>

        <div className="px-4 py-4 flex items-center justify-between max-w-lg mx-auto">
          <span
            className="text-sm"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#6E6E6E',
            }}
          >
            People like you
          </span>
          <span
            className="text-2xl font-bold"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#D1D1D1',
            }}
          >
            {state.currentPool.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
