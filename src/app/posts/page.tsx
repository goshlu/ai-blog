'use client';

import { useState, useEffect } from 'react';
import { PostList } from '@/components/PostList';
import type { Post } from '@/types/post';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPosts(data.posts);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <header className="mb-16 md:mb-24 mt-8 md:mt-12 px-2">
          <div className="h-12 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-6" />
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </header>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-16 md:mb-24 mt-8 md:mt-12 px-2">
        <h1 className="text-[2.5rem] md:text-6xl font-extrabold tracking-tight mb-6 text-zinc-800 dark:text-zinc-100">
          所有文章
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
          共 {posts.length} 篇文章
        </p>
      </header>

      <PostList posts={posts} />
    </div>
  );
}
