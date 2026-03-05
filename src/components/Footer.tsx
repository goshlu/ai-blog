import Link from 'next/link';
import { ThemeSwitch } from './ThemeSwitch';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-100 dark:border-zinc-800/50 bg-gradient-to-b from-transparent to-zinc-50/50 dark:to-zinc-900/30 pt-12 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Top Links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-zinc-500 dark:text-zinc-400 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400 dark:text-zinc-500">关于</span>
            <span className="text-zinc-200 dark:text-zinc-700">›</span>
            <Link href="/about" className="link-hover hover:text-pink-500 dark:hover:text-pink-400 transition-colors">关于本站</Link>
            <Link href="/about" className="link-hover hover:text-pink-500 dark:hover:text-pink-400 transition-colors">关于我</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="link-hover hover:text-pink-500 dark:hover:text-pink-400 transition-colors">关于此项目</a>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400 dark:text-zinc-500">更多</span>
            <span className="text-zinc-200 dark:text-zinc-700">›</span>
            <Link href="/gallery" className="link-hover hover:text-purple-500 dark:hover:text-purple-400 transition-colors">照片廊</Link>
            <Link href="/analytics" className="link-hover hover:text-purple-500 dark:hover:text-purple-400 transition-colors">埋点</Link>
            <Link href="/status" className="link-hover hover:text-purple-500 dark:hover:text-purple-400 transition-colors">监控</Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400 dark:text-zinc-500">联系</span>
            <span className="text-zinc-200 dark:text-zinc-700">›</span>
            <Link href="/message" className="link-hover hover:text-blue-500 dark:hover:text-blue-400 transition-colors">写留言</Link>
            <a href="mailto:example@gmail.com" className="link-hover hover:text-blue-500 dark:hover:text-blue-400 transition-colors">发邮件</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="link-hover hover:text-blue-500 dark:hover:text-blue-400 transition-colors">GitHub</a>
          </div>
        </div>

        {/* Middle Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-x-2 text-[13px] text-zinc-400 dark:text-zinc-500 font-medium">
              <span>© 2020-{currentYear}</span>
              <Link href="/" className="gradient-text font-bold">YSKM</Link>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <Link href="/feed.xml" className="link-hover hover:text-zinc-600 dark:hover:text-zinc-300">RSS</Link>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <Link href="/sitemap.xml" className="link-hover hover:text-zinc-600 dark:hover:text-zinc-300">站点地图</Link>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <Link href="/subscribe" className="link-hover hover:text-zinc-600 dark:hover:text-zinc-300">订阅</Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-2 text-[13px] text-zinc-400 dark:text-zinc-500">
              <span>Powered by</span>
              <span className="text-zinc-600 dark:text-zinc-300 font-medium">Next.js</span>
              <span className="text-zinc-300 dark:text-zinc-700">&</span>
              <span className="gradient-text font-bold">YSKM</span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" className="link-hover hover:text-zinc-600 dark:hover:text-zinc-300">萌ICP备2024xxxx号</a>
            </div>
            
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
              Stay hungry. Stay foolish.
            </p>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[13px] text-zinc-400 dark:text-zinc-500 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              <span>简体中文</span>
              <span className="text-[10px]">▼</span>
            </div>
            
            <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-800/50 rounded-full px-1.5 py-1.5 border border-zinc-200/50 dark:border-zinc-700/30 shadow-sm hover:shadow-md transition-shadow">
              <ThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
