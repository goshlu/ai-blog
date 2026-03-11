import Link from 'next/link';
import { ThemeSwitch } from './ThemeSwitch';
import { getMailtoHref, siteConfig } from '@/lib/site';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const showGithub = Boolean(siteConfig.githubUrl);
  const showEmail = Boolean(siteConfig.email);
  const showIcp = Boolean(siteConfig.icpNumber);

  return (
    <footer className="mt-auto border-t border-zinc-100 bg-gradient-to-b from-transparent to-zinc-50/50 pt-12 pb-20 dark:border-zinc-800/50 dark:to-zinc-900/30">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400 dark:text-zinc-500">关于</span>
            <span className="text-zinc-200 dark:text-zinc-700">/</span>
            <Link href="/about" className="link-hover transition-colors hover:text-pink-500 dark:hover:text-pink-400">
              关于本站
            </Link>
            <Link href="/about" className="link-hover transition-colors hover:text-pink-500 dark:hover:text-pink-400">
              关于我
            </Link>
            {showGithub ? (
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover transition-colors hover:text-pink-500 dark:hover:text-pink-400"
              >
                GitHub
              </a>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400 dark:text-zinc-500">更多</span>
            <span className="text-zinc-200 dark:text-zinc-700">/</span>
            <Link href="/more" className="link-hover transition-colors hover:text-purple-500 dark:hover:text-purple-400">
              导航
            </Link>
            <Link href="/timeline" className="link-hover transition-colors hover:text-purple-500 dark:hover:text-purple-400">
              时间线
            </Link>
            <Link href="/subscribe" className="link-hover transition-colors hover:text-purple-500 dark:hover:text-purple-400">
              订阅
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400 dark:text-zinc-500">联系</span>
            <span className="text-zinc-200 dark:text-zinc-700">/</span>
            {showEmail ? (
              <a
                href={getMailtoHref(siteConfig.email)}
                className="link-hover transition-colors hover:text-blue-500 dark:hover:text-blue-400"
              >
                发邮件
              </a>
            ) : null}
            {showGithub ? (
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover transition-colors hover:text-blue-500 dark:hover:text-blue-400"
              >
                GitHub
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-2 text-[13px] font-medium text-zinc-400 dark:text-zinc-500">
              <span>© 2020-{currentYear}</span>
              <Link href="/" className="gradient-text font-bold">
                YSKM
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <Link href="/feed.xml" className="link-hover hover:text-zinc-600 dark:hover:text-zinc-300">
                RSS
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <Link href="/sitemap.xml" className="link-hover hover:text-zinc-600 dark:hover:text-zinc-300">
                站点地图
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <Link href="/subscribe" className="link-hover hover:text-zinc-600 dark:hover:text-zinc-300">
                订阅
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 text-[13px] text-zinc-400 dark:text-zinc-500">
              <span>Powered by</span>
              <span className="font-medium text-zinc-600 dark:text-zinc-300">Next.js</span>
              <span className="text-zinc-300 dark:text-zinc-700">&amp;</span>
              <span className="gradient-text font-bold">YSKM</span>
              {showIcp ? (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">/</span>
                  <a
                    href="https://beian.miit.gov.cn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-hover hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    {siteConfig.icpNumber}
                  </a>
                </>
              ) : null}
            </div>

            <p className="text-xs italic text-zinc-400 dark:text-zinc-500">Stay hungry. Stay foolish.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="cursor-pointer text-[13px] text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
              简体中文
            </div>
            <div className="flex items-center rounded-full border border-zinc-200/50 bg-zinc-100/80 px-1.5 py-1.5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700/30 dark:bg-zinc-800/50">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
