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
      <header className="relative mb-20 mt-12 md:mb-28 md:mt-20">
        <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-pink-200/50 to-purple-200/50 blur-3xl dark:from-pink-900/20 dark:to-purple-900/20" />
        <div className="absolute right-0 top-20 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200/50 to-cyan-200/50 blur-3xl dark:from-blue-900/20 dark:to-cyan-900/20" />

        <h1 className="relative mb-4 text-[3rem] font-bold leading-tight tracking-tight text-zinc-800 dark:text-zinc-100 md:text-[5rem]">
          Hi, I&apos;m
          <br />
          <span className="gradient-text">YSKM</span>
        </h1>
        <p className="relative text-lg font-light leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-xl">
          A Full Stack Developer
        </p>

        <div className="relative mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span>Available for work</span>
          </div>
          {siteConfig.email ? (
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
            >
              Hire Me
            </Link>
          ) : null}
          {siteConfig.resumeUrl ? (
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              View Resume
            </a>
          ) : null}
        </div>
      </header>

      <section className="mb-16 overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white/90 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.10)] dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:shadow-[0_20px_70px_rgba(0,0,0,0.35)] md:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Projects</div>
            <h2 className="mb-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">A dedicated portfolio is now part of the site.</h2>
            <p className="text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Recruiters and clients can now review selected work, tech stacks, delivery highlights, and direct links from one place instead of piecing it together from blog posts.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Open Projects
            </Link>
            {siteConfig.githubUrl ? (
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                GitHub Profile
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse-slow" />
          Latest Posts
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-zinc-100 animate-pulse dark:bg-zinc-800" />
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
                  className="group/item -mx-3 flex items-center gap-4 rounded-lg border-b border-zinc-100 px-3 py-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-zinc-50 hover:to-transparent dark:border-zinc-800/50 dark:hover:from-zinc-800/30 dark:hover:to-transparent"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="link-hover flex-1 text-sm text-zinc-700 transition-colors group-hover/item:text-zinc-900 dark:text-zinc-200 dark:group-hover/item:text-zinc-100 md:text-base">
                    {post.title}
                  </span>
                  <time className="shrink-0 tabular-nums text-xs text-zinc-400 dark:text-zinc-500">{post.date}</time>
                </Link>
              );
            })}
            {posts.length === 0 && <div className="py-8 text-center text-zinc-400 dark:text-zinc-500">No posts yet.</div>}
          </div>
        )}
        <Link
          href="/posts"
          className="group mt-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-pink-500 dark:text-zinc-500 dark:hover:text-pink-400"
        >
          <span>View all posts</span>
          <span className="transition-transform group-hover:translate-x-1">/</span>
        </Link>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-400 dark:text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse-slow" />
          Latest Notes
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-zinc-100 animate-pulse dark:bg-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {notes.map((note, index) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group/item -mx-3 flex items-center gap-4 rounded-lg border-b border-zinc-100 px-3 py-3 transition-all duration-300 hover:bg-gradient-to-r hover:from-zinc-50 hover:to-transparent dark:border-zinc-800/50 dark:hover:from-zinc-800/30 dark:hover:to-transparent"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="link-hover flex-1 text-sm text-zinc-700 transition-colors group-hover/item:text-zinc-900 dark:text-zinc-200 dark:group-hover/item:text-zinc-100 md:text-base">
                  {note.title}
                </span>
                <time className="shrink-0 tabular-nums text-xs text-zinc-400 dark:text-zinc-500">{note.date}</time>
              </Link>
            ))}
            {notes.length === 0 && <div className="py-8 text-center text-zinc-400 dark:text-zinc-500">No notes yet.</div>}
          </div>
        )}
        <Link
          href="/notes"
          className="group mt-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-purple-500 dark:text-zinc-500 dark:hover:text-purple-400"
        >
          <span>View all notes</span>
          <span className="transition-transform group-hover:translate-x-1">/</span>
        </Link>
      </section>

      <section className="border-t border-zinc-100 pt-8 dark:border-zinc-800/80">
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/projects" className="link-hover transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">
            Projects
          </Link>
          <Link href="/posts" className="link-hover transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">
            Posts
          </Link>
          <Link href="/notes" className="link-hover transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">
            Notes
          </Link>
          <Link href="/contact" className="link-hover transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">
            Contact
          </Link>
          <Link href="/about" className="link-hover transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">
            About
          </Link>
          {siteConfig.githubUrl ? (
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              GitHub
            </a>
          ) : null}
          <a href="/feed.xml" className="link-hover transition-colors hover:text-zinc-700 dark:hover:text-zinc-200">
            RSS
          </a>
        </nav>
      </section>
    </div>
  );
}
