import { motion } from 'framer-motion';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-lg"
      >
        {/* Glowing background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #00f2ff 0%, #a855f7 100%)',
          }}
        />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative text-4xl md:text-6xl font-bold mb-4"
          style={{
            background: 'linear-gradient(135deg, #00f2ff 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          THE RARITY ENGINE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative text-white/60 text-lg md:text-xl mb-2"
        >
          Discover how rare you really are
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative text-white/40 text-sm mb-8"
        >
          Answer 25 questions. Watch 8 billion people become one.
        </motion.p>

        {/* Population counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="relative glass rounded-xl px-6 py-4 mb-8 inline-block"
        >
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
            Starting population
          </p>
          <p
            className="text-3xl md:text-4xl font-bold tabular-nums text-glow-cyan"
            style={{ color: '#00f2ff' }}
          >
            8,000,000,000
          </p>
        </motion.div>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative"
        >
          <button
            onClick={onStart}
            className="px-10 py-5 rounded-xl font-semibold text-lg text-black
                     transition-all duration-300 hover:scale-105 active:scale-95
                     animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, #00f2ff 0%, #00d4ff 100%)',
              boxShadow: '0 0 40px rgba(0, 242, 255, 0.4)',
            }}
          >
            Begin Your Journey
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative mt-8 text-white/30 text-xs"
        >
          Based on real-world statistics. Your uniqueness is calculated using
          multiplicative probability.
        </motion.p>
      </motion.div>
    </div>
  );
}
