import { Note } from '@/types/note';

export const notes: Note[] = [
  {
    id: '1',
    title: '键盘上的春节',
    date: '2024-02-10',
    weather: '晴',
    mood: '平静',
    location: '家里',
    content: `经过了一个比较长的假期，有半个月。明天就要节后第一天上班，感觉这个假期过得挺快的。

转眼的时间，好像恍如隔世。回想这个假期做了哪些事，好像也没有什么太大的进展。印象中，近几年感觉过年过节没有什么年味了，跟小时候相比越来越淡。

过年期间做的事没什么特别的，没有出去玩。主要的时间还是花在 AI 身上，让 AI 去帮我实现一些东西。

## 记录一些思考

在键盘上敲击出的春节，虽然少了些鞭炮声，但多了些思考的深度。AI 不仅仅是工具，它正在重塑我们的生活方式。`,
  },
  {
    id: '2',
    title: '深夜的灵感',
    date: '2024-03-01',
    weather: '雨',
    mood: '灵感迸发',
    content: `凌晨两点，突然对博客的交互有了一个新的想法。

有时候，好的创意总是在最安静的时候出现。这或许就是开发者独有的浪漫吧。`,
  },
];

export function getAllNotes(): Note[] {
  return notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNoteById(id: string): Note | undefined {
  return notes.find((note) => note.id === id);
}
