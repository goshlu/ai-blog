'use client';

import { useEffect, useMemo, useState } from 'react';
import { extractHeadings } from '@/lib/headings';

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

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClickHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
          目录
        </div>
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
      </div>

      {headings.length === 0 ? (
        <p className="mt-2 text-[12px] text-zinc-500 dark:text-zinc-400">
          本文没有可用的小标题。
        </p>
      ) : (
        <nav className="mt-2 space-y-1 text-[13px]">
          {headings.map((heading) => (
            <button
              key={heading.id}
              type="button"
              onClick={() => handleClickHeading(heading.id)}
              className={[
                'block w-full rounded-lg px-2 py-1.5 text-left transition-colors',
                heading.level === 1 ? 'font-semibold' : '',
                heading.level === 2 ? 'pl-2' : '',
                heading.level === 3 ? 'pl-5 text-[12px]' : '',
                activeId === heading.id
                  ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800/70',
              ].join(' ')}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
