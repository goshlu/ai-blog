import Link from 'next/link';
import { getMailtoHref, siteConfig, socialProfiles } from '@/lib/site';

export default function AboutPage() {
  const showEmail = Boolean(siteConfig.email);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-16">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">About Me</h1>
        <p className="text-zinc-500 dark:text-zinc-400">More about my work, this blog, and how I build products.</p>
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
          I use this site to document technical work, product thinking, and lessons from building with modern web stacks. It serves as both a writing space and a working portfolio.
        </p>
      </section>

      <section className="mb-12">
        <h3 className="mb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500">Tech Stack</h3>
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

      {(socialProfiles.length > 0 || showEmail) && (
        <section className="mb-12">
          <h3 className="mb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500">Profiles</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              <span>Contact Page</span>
              <span className="text-zinc-400">/</span>
            </Link>
            {showEmail ? (
              <a
                href={getMailtoHref(siteConfig.email)}
                className="flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                <span>Email</span>
                <span className="text-zinc-400">/</span>
              </a>
            ) : null}
            {socialProfiles.map((profile) => (
              <a
                key={profile.label}
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
              >
                <span>{profile.label}</span>
                <span className="text-zinc-400">/</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-zinc-100 pt-8 dark:border-zinc-800">
        <h3 className="mb-4 text-sm font-medium text-zinc-400 dark:text-zinc-500">About This Site</h3>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          The site runs on Next.js and Tailwind CSS, with ongoing work around content publishing, subscriptions, SEO, and portfolio presentation.
        </p>
      </section>

      <div className="mt-16">
        <Link
          href="/"
          className="text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
