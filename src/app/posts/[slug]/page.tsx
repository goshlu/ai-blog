import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { Button } from '@/components/ui/button';
import { TranslateButton } from '@/components/TranslateButton';
import { SmartSummary } from '@/components/SmartSummary';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-2 md:px-0 mt-8">
      <Link href="/" className="mb-8 md:mb-12 inline-flex">
        <Button variant="ghost" className="hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-2xl transition-colors font-medium text-zinc-500 -ml-4">
          ← 返回
        </Button>
      </Link>

      <header className="mb-10 md:mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 text-zinc-900 dark:text-zinc-50 leading-[1.3] text-balance">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-[13px] text-zinc-500 font-medium">
          <time className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full">
            发布于 {post.date}
          </time>
        </div>
      </header>

      <SmartSummary content={post.content} />

      <div className="prose prose-zinc prose-lg dark:prose-invert max-w-none mt-12 mb-16 break-words text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal selection:bg-blue-500/20">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-8 pb-12 flex justify-center">
        <TranslateButton content={post.content} />
      </div>
    </article>
  );
}
