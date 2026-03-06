'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="relative mx-auto max-w-3xl py-8 md:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-6 left-6 h-32 w-32 rounded-full bg-pink-200/50 blur-3xl dark:bg-pink-900/20" />
        <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20" />
      </div>

      <div className="rounded-[2rem] border border-zinc-100/80 bg-white/90 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.12)] dark:border-zinc-800/80 dark:bg-[#05060a]/95 dark:shadow-[0_18px_80px_rgba(0,0,0,0.65)] md:p-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          Error 404
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
          页面不存在
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 md:text-base">
          你访问的链接可能已失效，或者页面已经被移动。可以返回首页继续浏览，或者去文章列表看看最新内容。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-50 transition-all hover:shadow-[0_12px_28px_rgba(15,23,42,0.25)] dark:bg-zinc-50 dark:text-zinc-900"
          >
            返回首页
          </Link>

          <Link
            href="/posts"
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800/70"
          >
            浏览文章
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-200"
          >
            返回上一页
          </button>
        </div>
      </div>
    </section>
  );
}
