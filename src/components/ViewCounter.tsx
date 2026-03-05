'use client';

import { useEffect, useState } from 'react';

interface ViewCounterProps {
  slug: string;
}

export function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const key = `view-count:${slug}`;
    try {
      const raw = window.localStorage.getItem(key);
      const current = raw ? parseInt(raw, 10) || 0 : 0;
      const next = current + 1;
      window.localStorage.setItem(key, String(next));
      setViews(next);
    } catch {
      // localStorage 不可用时，回退为 null
      setViews(null);
    }
  }, [slug]);

  if (views === null) {
    return (
      <span className="px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900/70">
        浏览中…
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900/70">
      {views.toLocaleString()} 次阅读
    </span>
  );
}

