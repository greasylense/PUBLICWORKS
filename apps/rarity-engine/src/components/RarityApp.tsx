import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRarity } from '../context/RarityContext';
import ParticleCanvas from './ParticleCanvas';
import Odometer from './Odometer';
import QuestionCard from './QuestionCard';
import StartScreen from './StartScreen';
import ResultScreen from './ResultScreen';

type GamePhase = 'start' | 'playing' | 'zooming' | 'result';

export default function RarityApp() {
  const [phase, setPhase] = useState<GamePhase>('start');
  const { state, getCurrentQuestion, reset } = useRarity();

  const handleStart = useCallback(() => {
    setPhase('playing');
  }, []);

  const handleRestart = useCallback(() => {
    reset();
    setPhase('start');
  }, [reset]);

  // Check if we should transition to result
  const currentQuestion = getCurrentQuestion();

  // When all questions are answered, trigger zoom animation
  if (state.isComplete && phase === 'playing') {
    setTimeout(() => {
      setPhase('zooming');
      setTimeout(() => {
        setPhase('result');
      }, 3500);
    }, 500);
  }

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-[#050505]">
      {/* Particle Canvas - always rendered */}
      <ParticleCanvas isZooming={phase === 'zooming'} />

      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top-left glow */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#00f2ff' }}
        />
        {/* Bottom-right glow */}
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: '#a855f7' }}
        />
      </div>

      {/* Content layers */}
      <AnimatePresence mode="wait">
        {phase === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StartScreen onStart={handleStart} />
          </motion.div>
        )}

        {phase === 'playing' && currentQuestion && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            {/* Main content area */}
            <div className="flex items-center justify-center min-h-screen pb-32 md:pb-24 pt-8">
              <QuestionCard question={currentQuestion} />
            </div>

            {/* Odometer bar */}
            <Odometer />
          </motion.div>
        )}

        {phase === 'zooming' && (
          <motion.div
            key="zooming"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40"
          >
            {/* The zoom effect happens in the ParticleCanvas */}
            <div className="flex items-center justify-center h-full">
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ duration: 2, ease: 'easeIn' }}
              >
                <Odometer />
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ResultScreen onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
