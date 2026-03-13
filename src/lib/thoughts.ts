import { Thought } from '@/types/thought';

export const thoughts: Thought[] = [
  {
    id: 'thought-1',
    content: 'A portfolio should reduce uncertainty for the person evaluating you.',
    date: '2026-03-05',
  },
  {
    id: 'thought-2',
    content: 'The best product polish often comes from removing one small point of friction at a time.',
    date: '2026-03-01',
  },
  {
    id: 'thought-3',
    content: 'Typed content models are a quiet form of product quality.',
    date: '2026-02-28',
  },
  {
    id: 'thought-4',
    content: 'Shipping fallback states is part of shipping the feature.',
    date: '2026-02-20',
  },
  {
    id: 'thought-5',
    content: 'Clear writing is one of the fastest ways to signal engineering maturity.',
    date: '2026-02-15',
  },
];

export function getAllThoughts(): Thought[] {
  return [...thoughts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
