import { useEffect, useState, useRef } from 'react';
import { useRarity } from '../context/RarityContext';

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

export default function Odometer() {
  const { state, getProgress } = useRarity();
  const [displayValue, setDisplayValue] = useState(state.currentPool);
  const animationRef = useRef<number>(0);
  const startValueRef = useRef(state.currentPool);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const targetValue = state.currentPool;
    const startValue = displayValue;
    startValueRef.current = startValue;
    startTimeRef.current = Date.now();

    const duration = 1500; // 1.5 seconds for smooth animation

    const animateValue = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);

      const currentValue = Math.round(
        startValueRef.current + (targetValue - startValueRef.current) * eased
      );

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateValue);
      }
    };

    animationRef.current = requestAnimationFrame(animateValue);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [state.currentPool]);

  const progress = getProgress();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-strong">
      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00f2ff 0%, #a855f7 100%)',
            boxShadow: '0 0 20px rgba(0, 242, 255, 0.5)',
          }}
        />
      </div>

      {/* Odometer content */}
      <div className="px-4 py-4 md:py-5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider">
            People like you
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className="text-2xl md:text-3xl font-bold tabular-nums text-glow-cyan"
              style={{ color: '#00f2ff' }}
            >
              {formatNumber(displayValue)}
            </span>
          </div>
        </div>

        {/* Question counter */}
        <div className="max-w-md mx-auto mt-2 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                  i < state.currentQuestionIndex
                    ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,242,255,0.6)]'
                    : i === state.currentQuestionIndex
                    ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)] scale-125'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
