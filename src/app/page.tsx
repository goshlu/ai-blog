'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/lib/site';

interface Post {
  id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

interface Note {
  id: string;
  title: string;
  date: string;
  mood?: string;
  weather?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/posts').then((r) => r.json()),
      fetch('/api/notes').then((r) => r.json()),
    ])
      .then(([postsData, notesData]) => {
        if (postsData.success) setPosts(postsData.posts.slice(0, 5));
        if (notesData.success) setNotes(notesData.notes.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-20 md:mb-28 mt-12 md:mt-20 relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-pink-200/50 to-purple-200/50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/50 to-cyan-200/50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl" />

        <h1 className="relative text-[3rem] md:text-[5rem] font-bold tracking-tight mb-4 text-zinc-800 dark:text-zinc-100 leading-tight">
          Hi, I&apos;m
          <br />
          <span className="gradient-text">YSKM</span>
        </h1>
        <p className="relative text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
          A Full Stack Developer
        </p>

        <div className="relative mt-6 flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span>Available for work</span>
        </div>
      </header>

      <section className="mb-16">
        <h2 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse-slow" />
          Latest Posts
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="group space-y-1">
            {posts.map((post, index) => {
              const identifier = post.id ?? post.slug;
              return (
                <Link
                  key={identifier}
                  href={`/posts/${identifier}`}
                  className="group/item flex items-center gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-gradient-to-r hover:from-zinc-50 hover:to-transparent dark:hover:from-zinc-800/30 dark:hover:to-transparent -mx-3 px-3 rounded-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-200 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100 transition-colors flex-1 link-hover">
                    {post.title}
                  </span>
                  <time className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0 tabular-nums">
                    {post.date}
                  </time>
                </Link>
              );
            })}
            {posts.length === 0 && (
              <div className="py-8 text-center text-zinc-400 dark:text-zinc-500">
                No posts yet.
              </div>
            )}
          </div>
        )}
        <Link
          href="/posts"
          className="group inline-flex items-center gap-1 mt-6 text-sm text-zinc-400 dark:text-zinc-500 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
        >
          <span>View all posts</span>
          <span className="transition-transform group-hover:translate-x-1">/</span>
        </Link>
      </section>

      <section className="mb-16">
        <h2 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-slow" />
          Latest Notes
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {notes.map((note, index) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group/item flex items-center gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-gradient-to-r hover:from-zinc-50 hover:to-transparent dark:hover:from-zinc-800/30 dark:hover:to-transparent -mx-3 px-3 rounded-lg transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-200 group-hover/item:text-zinc-900 dark:group-hover/item:text-zinc-100 transition-colors flex-1 link-hover">
                  {note.title}
                </span>
                <time className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0 tabular-nums">
                  {note.date}
                </time>
              </Link>
            ))}
            {notes.length === 0 && (
              <div className="py-8 text-center text-zinc-400 dark:text-zinc-500">
                No notes yet.
              </div>
            )}
          </div>
        )}
        <Link
          href="/notes"
          className="group inline-flex items-center gap-1 mt-6 text-sm text-zinc-400 dark:text-zinc-500 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
        >
          <span>View all notes</span>
          <span className="transition-transform group-hover:translate-x-1">/</span>
        </Link>
      </section>

      <section className="pt-8 border-t border-zinc-100 dark:border-zinc-800/80">
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/posts" className="link-hover hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            Posts
          </Link>
          <Link href="/notes" className="link-hover hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            Notes
          </Link>
          <Link href="/about" className="link-hover hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
            About
          </Link>
          {siteConfig.githubUrl ? (
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            >
              GitHub
            </a>
          ) : null}
          <a
            href="/feed.xml"
            className="link-hover hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            RSS
          </a>
        </nav>
      </section>
    </div>
  );
}
