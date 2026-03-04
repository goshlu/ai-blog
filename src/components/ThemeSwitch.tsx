'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <span className="h-[1.2rem] w-[1.2rem]">🌓</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <span className="h-[1.2rem] w-[1.2rem]">☀️</span>
      ) : (
        <span className="h-[1.2rem] w-[1.2rem]">🌙</span>
      )}
    </Button>
  );
}
