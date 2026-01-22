import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRarity } from '../context/RarityContext';
import { formatRarity, getComparison, TOTAL_POPULATION } from '../data/questions';

interface ResultScreenProps {
  onRestart: () => void;
}

export default function ResultScreen({ onRestart }: ResultScreenProps) {
  const { state } = useRarity();
  const [phase, setPhase] = useState<'zoom' | 'glow' | 'reveal'>('zoom');
  const [showContent, setShowContent] = useState(false);

  const oneInX = Math.round(TOTAL_POPULATION / Math.max(state.currentPool, 1));
  const rarityText = formatRarity(state.currentPool);
  const comparison = getComparison(oneInX);

  useEffect(() => {
    // Phase timing
    const zoomTimer = setTimeout(() => setPhase('glow'), 3000);
    const glowTimer = setTimeout(() => setPhase('reveal'), 4500);
    const contentTimer = setTimeout(() => setShowContent(true), 5000);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(glowTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  const handleShare = async () => {
    const shareText = `I'm ${rarityText} people on Earth. That's rarer than ${comparison}! 🌟 Find your rarity:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Rarity Engine',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`${text} ${window.location.href}`);
    alert('Copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Zoom effect - single glowing dot */}
      <AnimatePresence>
        {phase === 'zoom' && (
          <motion.div
            initial={{ scale: 0.01, opacity: 1 }}
            animate={{ scale: 100, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-4 h-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, #00f2ff 0%, #a855f7 50%, transparent 70%)',
              boxShadow: '0 0 60px 30px rgba(0, 242, 255, 0.5)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Glow expansion */}
      <AnimatePresence>
        {phase === 'glow' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at center, rgba(0, 242, 255, 0.3) 0%, rgba(168, 85, 247, 0.1) 30%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Main content reveal */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 text-center px-6 max-w-lg mx-auto"
          >
            {/* Glowing orb behind text */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30"
              style={{
                background: 'radial-gradient(circle, #00f2ff 0%, #a855f7 100%)',
              }}
            />

            {/* YOU ARE label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative text-white/60 text-sm uppercase tracking-[0.3em] mb-4"
            >
              You are
            </motion.p>

            {/* Main rarity stat */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
              className="relative text-5xl md:text-7xl font-bold mb-6 text-glow-cyan"
              style={{
                background: 'linear-gradient(135deg, #00f2ff 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {rarityText}
            </motion.h1>

            {/* Comparison */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative text-white/70 text-lg md:text-xl mb-8"
            >
              That's rarer than{' '}
              <span className="text-purple-400 font-semibold">{comparison}</span>
            </motion.p>

            {/* Actual number */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="relative glass rounded-xl px-6 py-4 mb-8 inline-block"
            >
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
                People exactly like you
              </p>
              <p
                className="text-2xl font-bold tabular-nums"
                style={{ color: '#00f2ff' }}
              >
                {state.currentPool.toLocaleString()}
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="relative flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={handleShare}
                className="px-8 py-4 rounded-xl font-semibold text-black
                         transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #00f2ff 0%, #00d4ff 100%)',
                  boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)',
                }}
              >
                Share Your Rarity
              </button>

              <button
                onClick={onRestart}
                className="px-8 py-4 rounded-xl font-semibold text-white/80
                         border border-white/20 hover:border-white/40 hover:bg-white/5
                         transition-all duration-300"
              >
                Try Again
              </button>
            </motion.div>

            {/* Fun fact */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="relative mt-12 text-white/40 text-sm"
            >
              Out of 8 billion humans, only{' '}
              <span className="text-cyan-400">{state.currentPool.toLocaleString()}</span>{' '}
              share your exact combination of traits.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
