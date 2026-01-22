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

  // Start screen
  if (!started) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #00f2ff 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            THE RARITY ENGINE
          </h1>
          <p className="text-white/60 text-lg mb-2">Discover how rare you really are</p>
          <p className="text-white/40 text-sm mb-8">Answer 25 questions. Watch 8 billion become one.</p>

          <div className="glass rounded-xl px-6 py-4 mb-8 inline-block">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Starting population</p>
            <p className="text-3xl font-bold text-glow-cyan" style={{ color: '#00f2ff' }}>
              8,000,000,000
            </p>
          </div>

          <div>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-4 rounded-xl font-semibold text-lg text-black"
              style={{
                background: 'linear-gradient(135deg, #00f2ff 0%, #00d4ff 100%)',
                boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)',
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
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-white/60 text-sm uppercase tracking-widest mb-4">You are</p>
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, #00f2ff 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {formatRarity(state.currentPool)}
          </h1>
          <p className="text-white/70 text-xl mb-8">
            Rarer than <span className="text-purple-400 font-semibold">{getComparison(oneInX)}</span>
          </p>

          <div className="glass rounded-xl px-6 py-4 mb-8 inline-block">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">People like you</p>
            <p className="text-2xl font-bold" style={{ color: '#00f2ff' }}>
              {state.currentPool.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                reset();
                setStarted(false);
              }}
              className="px-8 py-4 rounded-xl font-semibold text-white/80 border border-white/20 hover:bg-white/5"
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
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6 pb-32">
        {currentQuestion && (
          <div className="w-full max-w-lg">
            <div className="glass-strong rounded-2xl p-6 md:p-8">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-4">
                Question {state.currentQuestionIndex + 1} of 25
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                {currentQuestion.question}
              </h2>

              {currentQuestion.subtext && (
                <p className="text-white/40 text-sm mb-6">{currentQuestion.subtext}</p>
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
                    className="w-full text-left px-5 py-4 rounded-xl bg-white/5 border border-white/10
                             hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-200"
                  >
                    <span className="text-white/90">{choice.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 glass-strong">
        <div className="h-1 bg-white/10">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${(state.currentQuestionIndex / 25) * 100}%`,
              background: 'linear-gradient(90deg, #00f2ff, #a855f7)',
            }}
          />
        </div>
        <div className="px-4 py-4 flex items-center justify-between max-w-lg mx-auto">
          <span className="text-white/60 text-sm">People like you</span>
          <span className="text-2xl font-bold text-glow-cyan" style={{ color: '#00f2ff' }}>
            {state.currentPool.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
