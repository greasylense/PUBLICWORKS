import type { Question, RarityComparison } from '../types';

export const TOTAL_POPULATION = 8_000_000_000;

export const questions: Question[] = [
  // BIO CATEGORY
  {
    id: 1,
    category: 'bio',
    question: "What's your biological sex?",
    choices: [
      { id: '1a', text: 'Male', weight: 0.505 },
      { id: '1b', text: 'Female', weight: 0.495 },
    ],
  },
  {
    id: 2,
    category: 'bio',
    question: 'What age bracket are you in?',
    choices: [
      { id: '2a', text: 'Under 18', weight: 0.26 },
      { id: '2b', text: '18-35', weight: 0.27 },
      { id: '2c', text: '36-55', weight: 0.25 },
      { id: '2d', text: 'Over 55', weight: 0.22 },
    ],
  },
  {
    id: 3,
    category: 'bio',
    question: 'Which hand do you write with?',
    subtext: 'Left-handedness is rarer than you think',
    choices: [
      { id: '3a', text: 'Right', weight: 0.90 },
      { id: '3b', text: 'Left', weight: 0.10 },
    ],
  },
  {
    id: 4,
    category: 'bio',
    question: 'What color are your eyes?',
    choices: [
      { id: '4a', text: 'Brown', weight: 0.79 },
      { id: '4b', text: 'Blue', weight: 0.10 },
      { id: '4c', text: 'Hazel/Amber', weight: 0.05 },
      { id: '4d', text: 'Green', weight: 0.02 },
      { id: '4e', text: 'Gray or other', weight: 0.04 },
    ],
  },
  {
    id: 5,
    category: 'bio',
    question: 'How does your height compare to average?',
    choices: [
      { id: '5a', text: 'Average', weight: 0.68 },
      { id: '5b', text: 'Above average', weight: 0.14 },
      { id: '5c', text: 'Below average', weight: 0.14 },
      { id: '5d', text: 'Extremely tall (top 1%)', weight: 0.02 },
      { id: '5e', text: 'Extremely short (bottom 1%)', weight: 0.02 },
    ],
  },

  // GEOGRAPHY CATEGORY
  {
    id: 6,
    category: 'geography',
    question: 'Which continent do you live on?',
    choices: [
      { id: '6a', text: 'Asia', weight: 0.595 },
      { id: '6b', text: 'Africa', weight: 0.175 },
      { id: '6c', text: 'Europe', weight: 0.095 },
      { id: '6d', text: 'North America', weight: 0.075 },
      { id: '6e', text: 'South America', weight: 0.055 },
      { id: '6f', text: 'Oceania', weight: 0.005 },
    ],
  },
  {
    id: 7,
    category: 'geography',
    question: 'What type of area do you live in?',
    choices: [
      { id: '7a', text: 'Major city (1M+)', weight: 0.35 },
      { id: '7b', text: 'Medium city', weight: 0.25 },
      { id: '7c', text: 'Small town', weight: 0.25 },
      { id: '7d', text: 'Rural area', weight: 0.15 },
    ],
  },
  {
    id: 8,
    category: 'geography',
    question: 'Do you live within 50km of the ocean?',
    choices: [
      { id: '8a', text: 'Yes', weight: 0.40 },
      { id: '8b', text: 'No', weight: 0.60 },
    ],
  },

  // LIFESTYLE CATEGORY
  {
    id: 9,
    category: 'lifestyle',
    question: 'Are you a morning person or night owl?',
    choices: [
      { id: '9a', text: 'Morning person', weight: 0.40 },
      { id: '9b', text: 'Night owl', weight: 0.35 },
      { id: '9c', text: 'Somewhere in between', weight: 0.25 },
    ],
  },
  {
    id: 10,
    category: 'lifestyle',
    question: 'What is your work situation?',
    choices: [
      { id: '10a', text: 'Work in an office', weight: 0.35 },
      { id: '10b', text: 'Work remotely', weight: 0.12 },
      { id: '10c', text: 'Hybrid', weight: 0.08 },
      { id: '10d', text: 'Student/Not working', weight: 0.30 },
      { id: '10e', text: 'Self-employed', weight: 0.15 },
    ],
  },
  {
    id: 11,
    category: 'lifestyle',
    question: 'Do you own a pet?',
    choices: [
      { id: '11a', text: 'Dog', weight: 0.25 },
      { id: '11b', text: 'Cat', weight: 0.20 },
      { id: '11c', text: 'Other pet', weight: 0.10 },
      { id: '11d', text: 'No pets', weight: 0.45 },
    ],
  },
  {
    id: 12,
    category: 'lifestyle',
    question: "What's your caffeine situation?",
    choices: [
      { id: '12a', text: 'Coffee addict (3+ cups)', weight: 0.15 },
      { id: '12b', text: 'Casual coffee/tea drinker', weight: 0.45 },
      { id: '12c', text: 'Energy drinks', weight: 0.10 },
      { id: '12d', text: 'Caffeine free', weight: 0.30 },
    ],
  },
  {
    id: 13,
    category: 'lifestyle',
    question: 'What is your diet?',
    choices: [
      { id: '13a', text: 'Omnivore', weight: 0.85 },
      { id: '13b', text: 'Vegetarian', weight: 0.08 },
      { id: '13c', text: 'Vegan', weight: 0.03 },
      { id: '13d', text: 'Other specific diet', weight: 0.04 },
    ],
  },

  // TECH/HABITS CATEGORY
  {
    id: 14,
    category: 'tech',
    question: 'iPhone or Android?',
    choices: [
      { id: '14a', text: 'iPhone', weight: 0.28 },
      { id: '14b', text: 'Android', weight: 0.70 },
      { id: '14c', text: 'No smartphone', weight: 0.02 },
    ],
  },
  {
    id: 15,
    category: 'tech',
    question: "What's your email inbox situation?",
    choices: [
      { id: '15a', text: 'Inbox Zero', weight: 0.15 },
      { id: '15b', text: 'Under 100 unread', weight: 0.35 },
      { id: '15c', text: '100-1000 unread', weight: 0.30 },
      { id: '15d', text: '1000+ unread chaos', weight: 0.20 },
    ],
  },
  {
    id: 16,
    category: 'tech',
    question: 'Do you sleep with socks on?',
    subtext: 'This one gets people heated',
    choices: [
      { id: '16a', text: 'Yes, always', weight: 0.08 },
      { id: '16b', text: 'Sometimes', weight: 0.12 },
      { id: '16c', text: 'Never, that\'s chaos', weight: 0.80 },
    ],
  },
  {
    id: 17,
    category: 'tech',
    question: 'How many browser tabs do you typically have open?',
    choices: [
      { id: '17a', text: '1-5 tabs', weight: 0.25 },
      { id: '17b', text: '6-20 tabs', weight: 0.40 },
      { id: '17c', text: '21-50 tabs', weight: 0.25 },
      { id: '17d', text: '50+ tabs', weight: 0.10 },
    ],
  },

  // NICHE CATEGORY
  {
    id: 18,
    category: 'niche',
    question: 'Can you whistle using your fingers?',
    choices: [
      { id: '18a', text: 'Yes, loudly', weight: 0.15 },
      { id: '18b', text: 'Barely', weight: 0.10 },
      { id: '18c', text: 'No', weight: 0.75 },
    ],
  },
  {
    id: 19,
    category: 'niche',
    question: 'Does cilantro taste like soap to you?',
    subtext: 'It\'s genetic!',
    choices: [
      { id: '19a', text: 'Yes, it\'s terrible', weight: 0.14 },
      { id: '19b', text: 'No, I love it', weight: 0.70 },
      { id: '19c', text: 'Never tried it', weight: 0.16 },
    ],
  },
  {
    id: 20,
    category: 'niche',
    question: 'Have you ever broken a bone?',
    choices: [
      { id: '20a', text: 'Yes', weight: 0.40 },
      { id: '20b', text: 'No', weight: 0.60 },
    ],
  },
  {
    id: 21,
    category: 'niche',
    question: 'How many languages can you speak conversationally?',
    choices: [
      { id: '21a', text: 'Just one', weight: 0.60 },
      { id: '21b', text: 'Two', weight: 0.30 },
      { id: '21c', text: 'Three or more', weight: 0.10 },
    ],
  },
  {
    id: 22,
    category: 'niche',
    question: 'Have you ever witnessed a total solar eclipse?',
    choices: [
      { id: '22a', text: 'Yes', weight: 0.05 },
      { id: '22b', text: 'Only partial', weight: 0.20 },
      { id: '22c', text: 'Never', weight: 0.75 },
    ],
  },

  // CURRENT STATE CATEGORY
  {
    id: 23,
    category: 'current',
    question: 'Have you moved to a new place in the last year?',
    choices: [
      { id: '23a', text: 'Yes', weight: 0.12 },
      { id: '23b', text: 'No', weight: 0.88 },
    ],
  },
  {
    id: 24,
    category: 'current',
    question: 'Are you currently in a relationship?',
    choices: [
      { id: '24a', text: 'Yes', weight: 0.55 },
      { id: '24b', text: 'No', weight: 0.40 },
      { id: '24c', text: 'It\'s complicated', weight: 0.05 },
    ],
  },
  {
    id: 25,
    category: 'current',
    question: 'Are you wearing a watch right now?',
    subtext: 'Be honest',
    choices: [
      { id: '25a', text: 'Yes, analog', weight: 0.12 },
      { id: '25b', text: 'Yes, smartwatch', weight: 0.15 },
      { id: '25c', text: 'No', weight: 0.73 },
    ],
  },
];

export const rarityComparisons: RarityComparison[] = [
  { threshold: 100, comparison: 'finding a four-leaf clover' },
  { threshold: 1_000, comparison: 'being struck by lightning' },
  { threshold: 10_000, comparison: 'becoming a professional athlete' },
  { threshold: 100_000, comparison: 'winning the lottery jackpot' },
  { threshold: 1_000_000, comparison: 'being an identical twin' },
  { threshold: 10_000_000, comparison: 'becoming a movie star' },
  { threshold: 100_000_000, comparison: 'being born with an extra finger' },
  { threshold: 1_000_000_000, comparison: 'having your exact DNA sequence' },
  { threshold: 8_000_000_000, comparison: 'existing at all' },
];

export function getComparison(oneInX: number): string {
  const sorted = [...rarityComparisons].sort((a, b) => a.threshold - b.threshold);
  for (const comp of sorted) {
    if (oneInX <= comp.threshold) {
      return comp.comparison;
    }
  }
  return sorted[sorted.length - 1].comparison;
}

export function formatRarity(pool: number): string {
  const oneInX = Math.round(TOTAL_POPULATION / Math.max(pool, 1));

  if (oneInX >= 1_000_000_000) {
    return `1 in ${(oneInX / 1_000_000_000).toFixed(1)} billion`;
  } else if (oneInX >= 1_000_000) {
    return `1 in ${(oneInX / 1_000_000).toFixed(1)} million`;
  } else if (oneInX >= 1_000) {
    return `1 in ${(oneInX / 1_000).toFixed(1)} thousand`;
  }
  return `1 in ${oneInX}`;
}
