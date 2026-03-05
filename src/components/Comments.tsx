'use client';

import { FormEvent, useEffect, useState } from 'react';

interface CommentItem {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface CommentsProps {
  slug: string;
}

export function Comments({ slug }: CommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const key = `comments:${slug}`;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as CommentItem[];
        setComments(parsed);
      }
    } catch {
      // ignore
    }
  }, [slug]);

  const persist = (next: CommentItem[]) => {
    const key = `comments:${slug}`;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const now = new Date();
    const item: CommentItem = {
      id: `${now.getTime()}`,
      name: name.trim() || '匿名访客',
      content: content.trim(),
      createdAt: now.toISOString(),
    };
    const next = [item, ...comments];
    setComments(next);
    persist(next);
    setContent('');
  };

  return (
    <section className="mt-8 md:mt-10 max-w-3xl">
      <div className="rounded-[1.75rem] border border-zinc-100 dark:border-zinc-800/80 bg-white/90 dark:bg-[#05060a]/95 px-4 md:px-6 py-5 md:py-6 shadow-[0_14px_45px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.8)]">
        <header className="mb-4 md:mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
              评论
            </h2>
            <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
              本地存储，不会上传到服务器，仅在当前浏览器中可见。
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-900/70 px-3 py-1 text-[11px] text-zinc-500">
            共 {comments.length} 条
          </span>
        </header>

        <form onSubmit={handleSubmit} className="space-y-3 mb-5">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="昵称（可选）"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full md:w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40"
            />
            <textarea
              placeholder="写点什么吧……（支持多行）"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/40 resize-y min-h-[60px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 px-4 py-1.5 text-[13px] font-medium shadow-sm hover:shadow-[0_10px_30px_rgba(15,23,42,0.25)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!content.trim()}
            >
              发表
            </button>
          </div>
        </form>

        {comments.length > 0 ? (
          <ul className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/50 px-3.5 py-2.5"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                    {c.name}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {c.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
            还没有评论，来留下你的想法吧。
          </p>
        )}
      </div>
    </section>
  );
}

