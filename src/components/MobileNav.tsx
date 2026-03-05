'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文稿' },
  { href: '/notes', label: '手记' },
  { href: '/timeline', label: '时光' },
  { href: '/thoughts', label: '思考' },
  { href: '/more', label: '更多' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 shadow-sm"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={cn(
              'w-5 h-0.5 bg-zinc-600 dark:bg-zinc-300 transition-transform',
              isOpen && 'rotate-45 translate-y-2'
            )}
          />
          <span
            className={cn(
              'w-5 h-0.5 bg-zinc-600 dark:bg-zinc-300 transition-opacity',
              isOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'w-5 h-0.5 bg-zinc-600 dark:bg-zinc-300 transition-transform',
              isOpen && '-rotate-45 -translate-y-2'
            )}
          />
        </div>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-lg z-50">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-500'
                      : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  )}
                >
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-pink-400" />
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
