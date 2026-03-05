import Link from 'next/link';

export default function MorePage() {
  const links = [
    {
      category: '项目',
      items: [
        { label: '博客源码', href: 'https://github.com', external: true },
        { label: '其他项目', href: 'https://github.com', external: true },
      ],
    },
    {
      category: '友链',
      items: [
        { label: '朋友 A', href: '#', external: false },
        { label: '朋友 B', href: '#', external: false },
      ],
    },
    {
      category: '其他',
      items: [
        { label: '照片廊', href: '/gallery', external: false },
        { label: '留言板', href: '/message', external: false },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          更多
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          发现更多有趣的内容
        </p>
      </header>

      <div className="space-y-8">
        {links.map((section) => (
          <section key={section.category}>
            <h2 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {section.items.map((item) => (
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="text-sm text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                      {item.label}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500">→</span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="text-sm text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                      {item.label}
                    </span>
                    <span className="text-zinc-400 dark:text-zinc-500">→</span>
                  </Link>
                )
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16">
        <Link
          href="/"
          className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
