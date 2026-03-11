import Link from 'next/link';
import { siteConfig } from '@/lib/site';

export default function MorePage() {
  const projectLinks = [
    siteConfig.githubUrl
      ? { label: 'GitHub 主页', href: siteConfig.githubUrl, external: true }
      : null,
    siteConfig.githubUrl
      ? { label: '博客源码', href: siteConfig.githubUrl, external: true }
      : null,
  ].filter(Boolean) as Array<{ label: string; href: string; external: boolean }>;

  const links = [
    {
      category: '项目',
      items: projectLinks,
    },
    {
      category: '页面',
      items: [
        { label: '时间线', href: '/timeline', external: false },
        { label: '邮件订阅', href: '/subscribe', external: false },
      ],
    },
  ].filter((section) => section.items.length > 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-12">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">更多</h1>
        <p className="text-zinc-500 dark:text-zinc-400">这里放一些站内导航和外部链接。</p>
      </header>

      <div className="space-y-8">
        {links.map((section) => (
          <section key={section.category}>
            <h2 className="mb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500">{section.category}</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {section.items.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50"
                  >
                    <span className="text-sm text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-100">
                      {item.label}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500">/</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/50"
                  >
                    <span className="text-sm text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-200 dark:group-hover:text-zinc-100">
                      {item.label}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500">/</span>
                  </Link>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16">
        <Link
          href="/"
          className="text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
