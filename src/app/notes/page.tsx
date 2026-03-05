import Link from 'next/link';
import { getAllNotes } from '@/lib/notes';

export default function NotesListPage() {
  const notes = getAllNotes();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          手记
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          记录生活中的点滴思考与感悟
        </p>
      </header>

      <div className="space-y-1">
        {notes.map((note) => (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            className="group block py-3 border-b border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 -mx-3 px-3 rounded-lg transition-colors"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                {note.title}
              </span>
              <time className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
                {note.date}
              </time>
            </div>
            {(note.mood || note.weather) && (
              <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                {[note.mood, note.weather].filter(Boolean).join(' · ')}
              </div>
            )}
          </Link>
        ))}
      </div>

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
