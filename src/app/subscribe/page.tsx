'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export default function SubscribePage() {
  const searchParams = useSearchParams();
  const defaultAction = searchParams.get('action') === 'unsubscribe' ? 'unsubscribe' : 'subscribe';
  const defaultEmail = searchParams.get('email') ?? '';

  const [mode, setMode] = useState<'subscribe' | 'unsubscribe'>(defaultAction);
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const buttonText = useMemo(() => {
    if (loading) return '提交中...';
    return mode === 'subscribe' ? '订阅更新' : '确认退订';
  }, [loading, mode]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      setResult({ ok: false, text: '请输入邮箱地址。' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const endpoint = mode === 'subscribe' ? '/api/subscriptions' : '/api/subscriptions/unsubscribe';
      const payload =
        mode === 'subscribe'
          ? { email: normalizedEmail, name: name.trim() }
          : { email: normalizedEmail };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setResult({ ok: false, text: data.error || '请求失败，请稍后重试。' });
        return;
      }

      setResult({ ok: true, text: data.message || (mode === 'subscribe' ? '订阅成功。' : '退订成功。') });
      if (mode === 'subscribe') {
        setName('');
      }
    } catch {
      setResult({ ok: false, text: '网络异常，请稍后再试。' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl py-10 md:py-14">
      <section className="rounded-[2rem] border border-zinc-100 bg-white/90 px-5 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.12)] dark:border-zinc-800/80 dark:bg-[#05060a]/95 md:px-8 md:py-9">
        <header className="mb-7">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            邮件订阅
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            订阅后，博客发布新文章时会给你发送更新通知。
          </p>
        </header>

        <div className="mb-6 inline-flex rounded-full border border-zinc-200 p-1 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setMode('subscribe')}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              mode === 'subscribe'
                ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/70'
            }`}
          >
            订阅
          </button>
          <button
            type="button"
            onClick={() => setMode('unsubscribe')}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              mode === 'unsubscribe'
                ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/70'
            }`}
          >
            退订
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'subscribe' ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">昵称（可选）</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={64}
                placeholder="例如：Kevin"
                className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:border-zinc-800 dark:text-zinc-100"
              />
            </div>
          ) : null}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">邮箱</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:border-zinc-800 dark:text-zinc-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-50 transition-all hover:shadow-[0_12px_32px_rgba(15,23,42,0.25)] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {buttonText}
          </button>

          {result ? (
            <p className={`text-sm ${result.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {result.text}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
