import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import prisma from '@/lib/db';
import { Comments } from '@/components/Comments';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const notes = await prisma.note.findMany();
  return notes.map((note) => ({ id: note.id }));
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link href="/" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-sm mb-12 inline-block">
        ← 返回首页
      </Link>

      <article className="relative">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
            {note.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500">
            <time>{note.date}</time>
            {note.weather && (
              <>
                <span className="text-zinc-200 dark:text-zinc-800">|</span>
                <span>天气：{note.weather}</span>
              </>
            )}
            {note.mood && (
              <>
                <span className="text-zinc-200 dark:text-zinc-800">|</span>
                <span>心情：{note.mood}</span>
              </>
            )}
          </div>
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none mb-16">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
        </div>

        <footer className="pt-8 border-t border-zinc-100 dark:border-zinc-800/80 mb-16">
          <div className="text-sm text-zinc-400 dark:text-zinc-500 italic">
            记录于某个角落
          </div>
        </footer>
      </article>

      <Comments slug={`note-${note.id}`} />
    </div>
  );
}
