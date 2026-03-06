'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function normalizeNextTarget(raw: string | null) {
  if (raw && raw.startsWith('/admin')) {
    return raw;
  }
  return '/admin';
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextTarget = useMemo(
    () => normalizeNextTarget(searchParams.get('next')),
    [searchParams],
  );

  const reason = searchParams.get('reason');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          next: nextTarget,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || '登录失败，请重试');
        return;
      }

      router.replace(data.redirectTo || nextTarget);
      router.refresh();
    } catch {
      setError('网络异常，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setPassword('');
    setError('已退出当前后台会话');
  };

  return (
    <div className="mx-auto max-w-md py-12 md:py-16">
      <section className="rounded-[2rem] border border-zinc-100 bg-white/90 px-6 py-8 shadow-[0_18px_60px_rgba(15,23,42,0.12)] dark:border-zinc-800/80 dark:bg-[#05060a]/95 md:px-8 md:py-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          后台登录
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          请输入管理员密码后进入管理后台。
        </p>

        {reason === 'admin_not_configured' ? (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400">
            后台鉴权尚未配置，请在环境变量中设置 `ADMIN_PASSWORD`。
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              管理员密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="请输入密码"
              className="w-full rounded-xl border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/60 dark:border-zinc-800 dark:text-zinc-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-50 transition-all hover:shadow-[0_12px_28px_rgba(15,23,42,0.25)] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {loading ? '登录中...' : '登录后台'}
          </button>

          {error ? (
            <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
          ) : null}
        </form>

        <div className="mt-8 flex items-center gap-3 text-sm">
          <button
            type="button"
            onClick={handleLogout}
            className="text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            退出当前会话
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <Link
            href="/"
            className="text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            返回首页
          </Link>
        </div>
      </section>
    </div>
  );
}
