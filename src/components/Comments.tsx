'use client';

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';

interface CommentItem {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface CommentsProps {
  slug: string;
}

const MAX_NAME_LENGTH = 24;
const MAX_CONTENT_LENGTH = 500;
const MAX_COMMENTS = 200;
const COMMENT_COOLDOWN_MS = 15_000;

function normalizeComment(raw: unknown): CommentItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Partial<CommentItem>;

  if (
    typeof item.id !== 'string' ||
    typeof item.name !== 'string' ||
    typeof item.content !== 'string' ||
    typeof item.createdAt !== 'string'
  ) {
    return null;
  }

  if (!item.content.trim()) {
    return null;
  }

  const created = new Date(item.createdAt);
  if (Number.isNaN(created.getTime())) {
    return null;
  }

  return {
    id: item.id,
    name: item.name.trim().slice(0, MAX_NAME_LENGTH) || '匿名访客',
    content: item.content.trim().slice(0, MAX_CONTENT_LENGTH),
    createdAt: created.toISOString(),
  };
}

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < 60_000) return '刚刚';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Comments({ slug }: CommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [lastCommentAt, setLastCommentAt] = useState<number>(0);
  const [notice, setNotice] = useState<string>('');

  useEffect(() => {
    const key = `comments:${slug}`;
    const cooldownKey = `comments:${slug}:last-comment-at`;

    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown[];
        const normalized = parsed
          .map((item) => normalizeComment(item))
          .filter((item): item is CommentItem => !!item)
          .slice(0, MAX_COMMENTS);

        setComments(normalized);
      } else {
        setComments([]);
      }

      const lastComment = Number(window.localStorage.getItem(cooldownKey) || '0');
      if (!Number.isNaN(lastComment)) {
        setLastCommentAt(lastComment);
      }
    } catch {
      setComments([]);
      setLastCommentAt(0);
    }
  }, [slug]);

  const persist = (next: CommentItem[]) => {
    const key = `comments:${slug}`;
    try {
      window.localStorage.setItem(key, JSON.stringify(next.slice(0, MAX_COMMENTS)));
    } catch {
      // ignore localStorage failures
    }
  };

  const persistLastCommentAt = (time: number) => {
    const cooldownKey = `comments:${slug}:last-comment-at`;
    try {
      window.localStorage.setItem(cooldownKey, String(time));
    } catch {
      // ignore localStorage failures
    }
  };

  const remainChars = MAX_CONTENT_LENGTH - content.length;
  const submitDisabled = !content.trim() || content.length > MAX_CONTENT_LENGTH;

  const cooldownRemainMs = useMemo(() => {
    const remain = lastCommentAt + COMMENT_COOLDOWN_MS - Date.now();
    return Math.max(0, remain);
  }, [lastCommentAt]);

  useEffect(() => {
    if (cooldownRemainMs <= 0) return;
    const timer = window.setInterval(() => {
      setLastCommentAt((prev) => prev);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownRemainMs]);

  const appendNotice = (text: string) => {
    setNotice(text);
    window.setTimeout(() => {
      setNotice((prev) => (prev === text ? '' : prev));
    }, 2200);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;

    const nowTs = Date.now();
    if (nowTs - lastCommentAt < COMMENT_COOLDOWN_MS) {
      const seconds = Math.ceil((COMMENT_COOLDOWN_MS - (nowTs - lastCommentAt)) / 1000);
      appendNotice(`请 ${seconds} 秒后再发一条评论`);
      return;
    }

    if (trimmed.length > MAX_CONTENT_LENGTH) {
      appendNotice(`评论最多 ${MAX_CONTENT_LENGTH} 字`);
      return;
    }

    const now = new Date(nowTs);
    const item: CommentItem = {
      id: `${nowTs}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim().slice(0, MAX_NAME_LENGTH) || '匿名访客',
      content: trimmed,
      createdAt: now.toISOString(),
    };

    const next = [item, ...comments].slice(0, MAX_COMMENTS);
    setComments(next);
    persist(next);
    setContent('');
    setLastCommentAt(nowTs);
    persistLastCommentAt(nowTs);
    appendNotice('评论已发布');
  };

  const handleDeleteOne = (id: string) => {
    const next = comments.filter((item) => item.id !== id);
    setComments(next);
    persist(next);
    appendNotice('评论已删除');
  };

  const handleClearAll = () => {
    if (comments.length === 0) return;
    const ok = window.confirm('确认清空当前文章的所有本地评论？');
    if (!ok) return;

    setComments([]);
    persist([]);
    appendNotice('评论已清空');
  };

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!submitDisabled) {
        const form = e.currentTarget.form;
        form?.requestSubmit();
      }
    }
  };

  const cooldownSeconds = Math.ceil(cooldownRemainMs / 1000);

  return (
    <section className="mt-8 max-w-3xl md:mt-10">
      <div className="rounded-[1.75rem] border border-zinc-100 bg-white/90 px-4 py-5 shadow-[0_14px_45px_rgba(15,23,42,0.12)] dark:border-zinc-800/80 dark:bg-[#05060a]/95 dark:shadow-[0_18px_60px_rgba(0,0,0,0.8)] md:px-6 md:py-6">
        <header className="mb-4 flex items-center justify-between gap-3 md:mb-5">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
              评论
            </h2>
            <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
              本地存储，不会上传到服务器，仅当前浏览器可见。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-[11px] text-zinc-500 dark:bg-zinc-900/70">
              共 {comments.length} 条
            </span>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-full px-3 py-1 text-[11px] text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
              disabled={comments.length === 0}
            >
              清空
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mb-5 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              maxLength={MAX_NAME_LENGTH}
              placeholder="昵称（可选）"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:border-zinc-800 dark:text-zinc-100 md:w-56"
            />
            <textarea
              placeholder="写点什么吧……（Ctrl/Cmd + Enter 快速发表）"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              rows={2}
              maxLength={MAX_CONTENT_LENGTH + 20}
              className="min-h-[60px] flex-1 resize-y rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:border-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[12px] text-zinc-500 dark:text-zinc-400">
              {cooldownRemainMs > 0
                ? `冷却中：${cooldownSeconds} 秒`
                : `剩余 ${Math.max(0, remainChars)} 字`}
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-1.5 text-[13px] font-medium text-zinc-50 shadow-sm transition-all hover:shadow-[0_10px_30px_rgba(15,23,42,0.25)] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
              disabled={submitDisabled}
            >
              发表
            </button>
          </div>

          {notice ? (
            <p className="text-[12px] text-emerald-600 dark:text-emerald-400">{notice}</p>
          ) : null}
        </form>

        {comments.length > 0 ? (
          <ul className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-xl border border-zinc-100 bg-zinc-50/80 px-3.5 py-2.5 dark:border-zinc-800/80 dark:bg-zinc-900/50"
              >
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
                      {comment.name}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteOne(comment.id)}
                    className="rounded-full px-2 py-1 text-[11px] text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-200"
                  >
                    删除
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {comment.content}
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
