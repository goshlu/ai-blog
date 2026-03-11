'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/posts', label: 'Posts' },
  { href: '/notes', label: 'Notes' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/thoughts', label: 'Thoughts' },
  { href: '/more', label: 'More' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/80 shadow-sm dark:border-zinc-700 dark:bg-zinc-800/80"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={cn(
              'h-0.5 w-5 bg-zinc-600 transition-transform dark:bg-zinc-300',
              isOpen && 'translate-y-2 rotate-45',
            )}
          />
          <span
            className={cn(
              'h-0.5 w-5 bg-zinc-600 transition-opacity dark:bg-zinc-300',
              isOpen && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'h-0.5 w-5 bg-zinc-600 transition-transform dark:bg-zinc-300',
              isOpen && '-translate-y-2 -rotate-45',
            )}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-4 right-4 top-full z-50 mt-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2.5 transition-colors',
                    isActive
                      ? 'bg-pink-50 text-pink-500 dark:bg-pink-900/20'
                      : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800',
                  )}
                >
                  {isActive && <span className="h-2 w-2 rounded-full bg-pink-400" />}
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
