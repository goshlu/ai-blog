'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { BlogCard } from '@/components/BlogCard';
import { PostLooseList } from '@/components/PostLooseList';
import { ViewToggle } from '@/components/ViewToggle';

type ViewMode = 'card' | 'loose';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const [mode, setMode] = useState<ViewMode>('card');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('viewMode') as ViewMode;
    if (saved) setMode(saved);

    const handleChange = (e: Event) => {
      setMode((e as CustomEvent).detail);
    };
    window.addEventListener('viewModeChange', handleChange);
    return () => window.removeEventListener('viewModeChange', handleChange);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 gap-8 md:gap-10">
        {posts.map((post) => (
          <BlogCard
            key={post.id ?? post.slug}
            slug={post.id ?? post.slug}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <ViewToggle />
      </div>
      {mode === 'card' ? (
        <div className="grid grid-cols-1 gap-8 md:gap-10">
          {posts.map((post) => {
            const identifier = post.id ?? post.slug;
            return (
              <BlogCard
                key={identifier}
                slug={identifier}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
              />
            );
          })}
        </div>
      ) : (
        <PostLooseList posts={posts} />
      )}
    </>
  );
}
