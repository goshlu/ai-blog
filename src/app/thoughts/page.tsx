import Link from 'next/link';
import { getAllThoughts } from '@/lib/thoughts';

export default function ThinkingPage() {
  const thoughts = getAllThoughts();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          思考
        </h1>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">
          谢谢你听我诉说
        </p>
      </header>

      {/* 思考列表 */}
      <div className="space-y-6">
        {thoughts.map((thought) => (
          <article
            key={thought.id}
            className="group relative py-4 border-b border-zinc-100 dark:border-zinc-800/80"
          >
            <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-200 leading-relaxed">
              {thought.content}
            </p>
            <time className="block mt-2 text-xs text-zinc-400 dark:text-zinc-500">
              {thought.date}
            </time>
          </article>
        ))}
      </div>

      {/* 返回首页 */}
      <div className="mt-16 text-center">
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
