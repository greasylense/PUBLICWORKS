export interface Choice {
  id: string;
  text: string;
  weight: number; // Percentage of population (0-1)
}

export interface Question {
  id: number;
  category: 'bio' | 'geography' | 'lifestyle' | 'tech' | 'niche' | 'current';
  question: string;
  subtext?: string;
  choices: Choice[];
}

export interface Answer {
  questionId: number;
  choiceId: string;
  weight: number;
}

export interface RarityState {
  currentQuestionIndex: number;
  answers: Answer[];
  currentPool: number;
  isComplete: boolean;
  isTransitioning: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  targetX?: number;
  targetY?: number;
  isDying: boolean;
  deathProgress: number;
}

export interface RarityComparison {
  threshold: number;
  comparison: string;
}
