import { motion, AnimatePresence } from 'framer-motion';
import { useRarity } from '../context/RarityContext';
import type { Question, Choice } from '../types';

interface QuestionCardProps {
  question: Question;
}

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
  },
};

const getCategoryColor = (category: Question['category']) => {
  switch (category) {
    case 'bio':
      return 'from-cyan-500/20 to-cyan-600/10';
    case 'geography':
      return 'from-emerald-500/20 to-emerald-600/10';
    case 'lifestyle':
      return 'from-purple-500/20 to-purple-600/10';
    case 'tech':
      return 'from-blue-500/20 to-blue-600/10';
    case 'niche':
      return 'from-pink-500/20 to-pink-600/10';
    case 'current':
      return 'from-amber-500/20 to-amber-600/10';
    default:
      return 'from-white/10 to-white/5';
  }
};

const getCategoryLabel = (category: Question['category']) => {
  switch (category) {
    case 'bio':
      return 'Biology';
    case 'geography':
      return 'Geography';
    case 'lifestyle':
      return 'Lifestyle';
    case 'tech':
      return 'Tech & Habits';
    case 'niche':
      return 'Niche';
    case 'current':
      return 'Current State';
    default:
      return category;
  }
};

export default function QuestionCard({ question }: QuestionCardProps) {
  const { answerQuestion, state, setTransitioning } = useRarity();

  const handleChoice = (choice: Choice) => {
    setTransitioning(true);

    setTimeout(() => {
      answerQuestion({
        questionId: question.id,
        choiceId: choice.id,
        weight: choice.weight,
      });
      setTransitioning(false);
    }, 300);
  };

  return (
    <AnimatePresence mode="wait" custom={1}>
      <motion.div
        key={question.id}
        custom={1}
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full max-w-lg mx-auto px-4 md:px-0"
      >
        {/* Desktop: Glassmorphism card */}
        <div className="hidden md:block glass-strong rounded-2xl p-8 glow-cyan">
          {/* Category badge */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(
              question.category
            )} mb-6`}
          >
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
              {getCategoryLabel(question.category)}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {question.question}
          </h2>

          {question.subtext && (
            <p className="text-white/50 text-sm mb-6">{question.subtext}</p>
          )}

          {/* Choices */}
          <div className="space-y-3 mt-6">
            {question.choices.map((choice, i) => (
              <motion.button
                key={choice.id}
                custom={i}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleChoice(choice)}
                disabled={state.isTransitioning}
                className="w-full text-left px-6 py-4 rounded-xl bg-white/5 border border-white/10
                         hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,242,255,0.2)]
                         transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg text-white/90">{choice.text}</span>
              </motion.button>
            ))}
          </div>

          {/* Question number */}
          <div className="mt-8 text-center">
            <span className="text-white/30 text-sm">
              Question {question.id} of 25
            </span>
          </div>
        </div>

        {/* Mobile: Bottom sheet style */}
        <div className="md:hidden fixed inset-x-0 bottom-20 top-auto glass-strong rounded-t-3xl p-6 pt-8">
          {/* Handle indicator */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full" />

          {/* Category badge */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(
              question.category
            )} mb-4`}
          >
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
              {getCategoryLabel(question.category)}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl font-bold text-white mb-1">{question.question}</h2>

          {question.subtext && (
            <p className="text-white/50 text-xs mb-4">{question.subtext}</p>
          )}

          {/* Choices - larger tap targets for mobile */}
          <div className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto pb-4">
            {question.choices.map((choice, i) => (
              <motion.button
                key={choice.id}
                custom={i}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileTap="tap"
                onClick={() => handleChoice(choice)}
                disabled={state.isTransitioning}
                className="w-full text-left px-5 py-4 rounded-xl bg-white/5 border border-white/10
                         active:bg-cyan-500/20 active:border-cyan-500/50
                         transition-all duration-150 disabled:opacity-50"
              >
                <span className="text-base text-white/90">{choice.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
