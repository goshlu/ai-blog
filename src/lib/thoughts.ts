import { Thought } from '@/types/thought';

export const thoughts: Thought[] = [
  {
    id: '1',
    content: '代码是写给人看的，顺便能在机器上运行。',
    date: '2024-03-05',
  },
  {
    id: '2',
    content: '简单是可靠的先决条件。',
    date: '2024-03-01',
  },
  {
    id: '3',
    content: '最好的代码是没有代码。',
    date: '2024-02-28',
  },
  {
    id: '4',
    content: '有时候，慢就是快。',
    date: '2024-02-20',
  },
  {
    id: '5',
    content: '技术是工具，不是目的。',
    date: '2024-02-15',
  },
];

export function getAllThoughts(): Thought[] {
  return thoughts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
