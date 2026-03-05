'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Post {
  id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

interface Note {
  id: string;
  title: string;
  date: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取文章列表
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      });

    // 获取手记列表
    fetch('/api/notes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotes(data.notes);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          管理中心
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          管理博客内容和设置
        </p>
      </header>

      {/* 快捷操作 */}
      <section className="mb-12">
        <h2 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4">
          快捷操作
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/posts/new"
            className="group p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10 border border-pink-100 dark:border-pink-800/30 hover:shadow-lg hover:shadow-pink-500/10 transition-all"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              新建文章
            </div>
          </Link>

          <Link
            href="/admin/posts"
            className="group p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 border border-purple-100 dark:border-purple-800/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              文章管理
            </div>
          </Link>

          <Link
            href="/admin#ai"
            className="group p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-100 dark:border-blue-800/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
          >
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              AI 摘要
            </div>
          </Link>

          <Link
            href="/admin#stats"
            className="group p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border border-green-100 dark:border-green-800/30 hover:shadow-lg hover:shadow-green-500/10 transition-all"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              数据统计
            </div>
          </Link>
        </div>
      </section>

      {/* 统计信息 */}
      <section id="stats" className="mb-12">
        <h2 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4">
          内容统计
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="text-3xl font-bold gradient-text">
              {posts.length}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              文章总数
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="text-3xl font-bold gradient-text">
              {notes.length}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              手记总数
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="text-3xl font-bold gradient-text">
              {(posts.reduce((acc, p) => acc + p.content.length, 0) / 1000).toFixed(1)}k
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              总字数
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            <div className="text-3xl font-bold gradient-text">
              {new Date().getFullYear() - 2024 + 1}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              运行年份
            </div>
          </div>
        </div>
      </section>

      {/* 最近文章 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
            最近文章
          </h2>
          <Link
            href="/admin/posts"
            className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            查看全部 →
          </Link>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {posts.slice(0, 5).map((post) => {
              const identifier = post.id ?? post.slug;
              return (
                <Link
                  key={identifier}
                  href={`/admin/posts/edit/${identifier}`}
                  className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                      {post.title}
                    </div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-1">
                      {post.excerpt || '暂无摘要'}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400 dark:text-zinc-500">
                    {post.date}
                  </div>
                </Link>
              );
            })}
            {posts.length === 0 && (
              <div className="p-8 text-center text-zinc-400 dark:text-zinc-500">
                暂无文章，点击「新建文章」开始创作
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
