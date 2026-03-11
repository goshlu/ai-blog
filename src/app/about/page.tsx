import Link from 'next/link';
import { getMailtoHref, siteConfig } from '@/lib/site';

export default function AboutPage() {
  const showGithub = Boolean(siteConfig.githubUrl);
  const showEmail = Boolean(siteConfig.email);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-16">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">关于我</h1>
        <p className="text-zinc-500 dark:text-zinc-400">了解更多关于我和这个博客的信息。</p>
      </header>

      <section className="mb-12">
        <div className="mb-6 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-2xl font-bold text-white">
            Y
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">YSKM</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Full Stack Developer</p>
          </div>
        </div>
        <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
          这里记录我的技术实践、项目构建过程和对产品开发的思考。这个博客会持续整理开发经验，也会保留一些更个人化的写作内容。
        </p>
      </section>

      <section className="mb-12">
        <h3 className="mb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500">技术栈</h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'SQLite', 'Prisma'].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {(showGithub || showEmail) && (
        <section className="mb-12">
          <h3 className="mb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500">联系我</h3>
          <div className="flex flex-wrap gap-4">
            {showGithub ? (
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                <span>GitHub</span>
                <span className="text-zinc-400">/</span>
              </a>
            ) : null}
            {showEmail ? (
              <a
                href={getMailtoHref(siteConfig.email)}
                className="flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                <span>Email</span>
                <span className="text-zinc-400">/</span>
              </a>
            ) : null}
          </div>
        </section>
      )}

      <section className="border-t border-zinc-100 pt-8 dark:border-zinc-800">
        <h3 className="mb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500">关于本站</h3>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          本站使用 Next.js 与 Tailwind CSS 构建，围绕博客写作、订阅、SEO 和内容管理做了持续迭代。
        </p>
      </section>

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
