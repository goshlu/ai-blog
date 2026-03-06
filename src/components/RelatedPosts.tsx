import Link from 'next/link';
import { ArrowRight, Clock3, Sparkles } from 'lucide-react';
import { calculateReadingTime } from '@/lib/reading-time';

interface RelatedTag {
  id: string;
  name: string;
}

interface RelatedPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  date: string;
  tags?: RelatedTag[];
}

interface RelatedPostsProps {
  posts: RelatedPostItem[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 md:mt-14">
      <div className="mb-5 flex items-center gap-3 md:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-50 shadow-sm dark:bg-zinc-100 dark:text-zinc-900">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-xl">
            相关推荐
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            根据标签和内容相似度为你挑了几篇。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {posts.map((post) => {
          const identifier = post.id || post.slug;
          const readingTime = calculateReadingTime(post.content);

          return (
            <Link
              key={identifier}
              href={`/posts/${identifier}`}
              className="group rounded-[1.5rem] border border-zinc-100 bg-white/90 p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-200 hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)] dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:hover:border-zinc-700"
            >
              <article className="flex h-full flex-col">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-400">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-900/80">
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 dark:bg-zinc-900/80">
                    <Clock3 className="h-3.5 w-3.5" />
                    {readingTime} 分钟
                  </span>
                </div>

                <h3 className="mb-3 line-clamp-2 text-base font-semibold leading-6 text-zinc-900 transition-colors group-hover:text-pink-500 dark:text-zinc-100 dark:group-hover:text-pink-400 md:text-lg">
                  {post.title}
                </h3>

                <p className="line-clamp-3 flex-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {post.excerpt || '这篇文章和当前内容主题接近，适合继续阅读。'}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="rounded-full border border-pink-100 bg-pink-50 px-2.5 py-1 text-[11px] font-medium text-pink-600 dark:border-pink-800/50 dark:bg-pink-900/20 dark:text-pink-400"
                      >
                        # {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                  继续阅读
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
