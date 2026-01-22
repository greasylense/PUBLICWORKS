import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { RarityState, Answer } from '../types';
import { TOTAL_POPULATION, questions } from '../data/questions';

type RarityAction =
  | { type: 'ANSWER_QUESTION'; answer: Answer }
  | { type: 'SET_TRANSITIONING'; isTransitioning: boolean }
  | { type: 'RESET' };

interface RarityContextType {
  state: RarityState;
  answerQuestion: (answer: Answer) => void;
  setTransitioning: (isTransitioning: boolean) => void;
  reset: () => void;
  getCurrentQuestion: () => typeof questions[0] | null;
  getProgress: () => number;
}

const initialState: RarityState = {
  currentQuestionIndex: 0,
  answers: [],
  currentPool: TOTAL_POPULATION,
  isComplete: false,
  isTransitioning: false,
};

function calculatePool(answers: Answer[]): number {
  if (answers.length === 0) return TOTAL_POPULATION;

  const multiplier = answers.reduce((acc, answer) => acc * answer.weight, 1);
  const pool = Math.round(TOTAL_POPULATION * multiplier);

  // Floor of 1 - the user always exists
  return Math.max(pool, 1);
}

function rarityReducer(state: RarityState, action: RarityAction): RarityState {
  switch (action.type) {
    case 'ANSWER_QUESTION': {
      const newAnswers = [...state.answers, action.answer];
      const newPool = calculatePool(newAnswers);
      const nextIndex = state.currentQuestionIndex + 1;
      const isComplete = nextIndex >= questions.length;

      return {
        ...state,
        answers: newAnswers,
        currentPool: newPool,
        currentQuestionIndex: nextIndex,
        isComplete,
      };
    }
    case 'SET_TRANSITIONING':
      return {
        ...state,
        isTransitioning: action.isTransitioning,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const RarityContext = createContext<RarityContextType | undefined>(undefined);

export function RarityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rarityReducer, initialState);

  const answerQuestion = useCallback((answer: Answer) => {
    dispatch({ type: 'ANSWER_QUESTION', answer });
  }, []);

  const setTransitioning = useCallback((isTransitioning: boolean) => {
    dispatch({ type: 'SET_TRANSITIONING', isTransitioning });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const getCurrentQuestion = useCallback(() => {
    if (state.currentQuestionIndex >= questions.length) return null;
    return questions[state.currentQuestionIndex];
  }, [state.currentQuestionIndex]);

  const getProgress = useCallback(() => {
    return (state.currentQuestionIndex / questions.length) * 100;
  }, [state.currentQuestionIndex]);

  return (
    <RarityContext.Provider
      value={{
        state,
        answerQuestion,
        setTransitioning,
        reset,
        getCurrentQuestion,
        getProgress,
      }}
    >
      {children}
    </RarityContext.Provider>
  );
}

export function useRarity() {
  const context = useContext(RarityContext);
  if (context === undefined) {
    throw new Error('useRarity must be used within a RarityProvider');
  }
  return context;
}
