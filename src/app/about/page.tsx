import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <header className="mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
          关于我
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          了解更多关于我的故事
        </p>
      </header>

      {/* 个人介绍 */}
      <section className="mb-12">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
            Y
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">YSKM</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Full Stack Developer</p>
          </div>
        </div>
        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
          你好！我是一名热爱技术的开发者，专注于 Web 开发和人工智能应用。
          喜欢用代码创造有趣的东西，相信技术可以让生活变得更美好。
        </p>
      </section>

      {/* 技术栈 */}
      <section className="mb-12">
        <h3 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4">
          技术栈
        </h3>
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* 联系方式 */}
      <section className="mb-12">
        <h3 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4">
          联系我
        </h3>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <span>GitHub</span>
            <span className="text-zinc-400">→</span>
          </a>
          <a
            href="mailto:example@gmail.com"
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <span>Email</span>
            <span className="text-zinc-400">→</span>
          </a>
        </div>
      </section>

      {/* 关于本站 */}
      <section className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 mb-4">
          关于本站
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          本站使用 Next.js 14 构建，采用 Tailwind CSS 进行样式设计，
          集成了 AI 功能包括智能摘要生成和一键翻译。
        </p>
      </section>

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
