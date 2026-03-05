import Link from 'next/link';
import { Post } from '@/types/post';

interface PostLooseItemProps {
  post: Post;
}

export function PostLooseItem({ post }: PostLooseItemProps) {
  const identifier = post.id ?? post.slug;
  return (
    <Link
      href={`/posts/${identifier}`}
      className="group block py-3 border-b border-zinc-100 dark:border-zinc-800/80 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 -mx-3 px-3 rounded-lg transition-colors"
    >
      <article className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors line-clamp-1">
          {post.title}
        </h2>
        <time className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
          {post.date}
        </time>
      </article>
      {post.excerpt && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}

interface PostLooseListProps {
  posts: Post[];
}

export function PostLooseList({ posts }: PostLooseListProps) {
  return (
    <div className="space-y-1">
      {posts.map((post) => (
        <PostLooseItem key={post.id ?? post.slug} post={post} />
      ))}
    </div>
  );
}
