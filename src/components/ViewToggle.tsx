'use client';

import { useState, useEffect } from 'react';

type ViewMode = 'card' | 'loose';

export function ViewToggle() {
  const [mode, setMode] = useState<ViewMode>('card');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('viewMode') as ViewMode;
    if (saved) setMode(saved);
  }, []);

  const handleToggle = (newMode: ViewMode) => {
    setMode(newMode);
    localStorage.setItem('viewMode', newMode);
    window.dispatchEvent(new CustomEvent('viewModeChange', { detail: newMode }));
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
      <button
        onClick={() => handleToggle('card')}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          mode === 'card'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
      >
        卡片
      </button>
      <button
        onClick={() => handleToggle('loose')}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
          mode === 'loose'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
      >
        手稿
      </button>
    </div>
  );
}

export function getViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'card';
  return (localStorage.getItem('viewMode') as ViewMode) || 'card';
}
