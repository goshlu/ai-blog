'use client';

import { useEffect, useMemo, useState } from 'react';

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractHeadings(content: string): HeadingItem[] {
  return content
    .split('\n')
    .map((line) => {
      const match = /^(#{1,6})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const level = match[1].length;
      const text = match[2].trim();
      if (level > 3) return null; // 只展示 h1-h3，主要是 h2/h3
      return {
        id: slugify(text),
        text,
        level,
      };
    })
    .filter((x): x is HeadingItem => !!x);
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0.1,
      },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClickHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-950/60 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
          目录
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
      </div>

      {headings.length === 0 ? (
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-2">
          本文没有可用的小标题。
        </p>
      ) : (
        <nav className="mt-2 space-y-1 text-[13px]">
          {headings.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => handleClickHeading(h.id)}
              className={[
                'block w-full text-left rounded-lg px-2 py-1.5 transition-colors',
                h.level === 1 ? 'font-semibold' : '',
                h.level === 2 ? 'pl-2' : '',
                h.level === 3 ? 'pl-5 text-[12px]' : '',
                activeId === h.id
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70',
              ].join(' ')}
            >
              {h.text}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}


