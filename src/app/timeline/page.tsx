'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimelineItem {
  date: string;
  title: string;
  href: string;
  type: 'post' | 'note';
  meta?: string;
  year: number;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getYearProgress(date: Date): string {
  const start = new Date(date.getFullYear(), 0, 1);
  const end = new Date(date.getFullYear() + 1, 0, 1);
  const progress = (date.getTime() - start.getTime()) / (end.getTime() - start.getTime());
  return (progress * 100).toFixed(6);
}

function getDayProgress(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const progress = totalSeconds / 86400;
  return (progress * 100).toFixed(6);
}

export default function TimelinePage() {
  const [posts, setPosts] = useState<Array<{ id?: string; slug: string; title: string; date: string }>>([]);
  const [notes, setNotes] = useState<Array<{ id: string; title: string; date: string; mood?: string; weather?: string }>>([]);
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/api/posts').then((r) => r.json()),
      fetch('/api/notes').then((r) => r.json()),
    ])
      .then(([postsData, notesData]) => {
        if (postsData.success) setPosts(postsData.posts);
        if (notesData.success) setNotes(notesData.notes);
      })
      .finally(() => setLoading(false));
  }, []);

  const dayOfYear = getDayOfYear(now);
  const yearProgress = getYearProgress(now);
  const dayProgress = getDayProgress(now);

  // 合并 posts 和 notes
  const timelineItems: TimelineItem[] = [
    ...posts.map((post) => {
      const identifier = post.id ?? post.slug;
      return {
        date: post.date,
        title: post.title,
        href: `/posts/${identifier}`,
        type: 'post' as const,
        meta: '博文',
        year: new Date(post.date).getFullYear(),
      };
    }),
    ...notes.map((note) => {
      const metaParts = [];
      if (note.mood) metaParts.push(`心情：${note.mood}`);
      if (note.weather) metaParts.push(`天气：${note.weather}`);
      return {
        date: note.date,
        title: note.title,
        href: `/notes/${note.id}`,
        type: 'note' as const,
        meta: metaParts.length > 0 ? `${metaParts.join('/')}/手记` : '手记',
        year: new Date(note.date).getFullYear(),
      };
    }),
  ];

  // 按日期排序
  timelineItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 按年份分组
  const groupedByYear: Record<number, TimelineItem[]> = {};
  timelineItems.forEach((item) => {
    if (!groupedByYear[item.year]) {
      groupedByYear[item.year] = [];
    }
    groupedByYear[item.year].push(item);
  });

  const years = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          时间线
        </h1>
        <h3 className="text-lg text-zinc-500 dark:text-zinc-400">
          共有 {timelineItems.length} 篇，再接再厉
        </h3>
      </header>

      {/* 进度信息 */}
      <div className="mb-12 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          今天是 {now.getFullYear()} 年的第{dayOfYear}天
        </p>
        <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <p>今年已过 {yearProgress}%</p>
          <p>今天已过 {dayProgress}%</p>
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-4 italic">
          活在当下，珍惜眼下
        </p>
      </div>

      {/* 时间线列表 */}
      <div className="space-y-8">
        {years.map((year) => (
          <section key={year}>
            <h4 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4">
              {year}（{groupedByYear[year].length}）
            </h4>
            <div className="space-y-1">
              {groupedByYear[year].map((item, index) => {
                const date = new Date(item.date);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                
                return (
                  <Link
                    key={`${item.href}-${index}`}
                    href={item.href}
                    className="group flex items-center gap-3 py-2 px-3 -mx-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <time className="text-xs text-zinc-400 dark:text-zinc-500 w-14 shrink-0 tabular-nums">
                      {month}/{day}
                    </time>
                    <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors flex-1">
                      {item.title}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
                      {item.meta}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* 返回首页 */}
      <div className="mt-16">
        <Link
          href="/"
          className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
