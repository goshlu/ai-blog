import Link from 'next/link';
import { getHireMeMailtoHref, siteConfig } from '@/lib/site';

const contactChannels = [
  siteConfig.email
    ? {
        label: 'Email',
        value: siteConfig.email,
        href: getHireMeMailtoHref(siteConfig.email),
        description: 'Best for hiring, freelance work, and direct project discussions.',
      }
    : null,
  siteConfig.githubUrl
    ? {
        label: 'GitHub',
        value: siteConfig.githubUrl,
        href: siteConfig.githubUrl,
        description: 'Review repositories, commits, and public technical work.',
      }
    : null,
  siteConfig.resumeUrl
    ? {
        label: 'Resume',
        value: siteConfig.resumeUrl,
        href: siteConfig.resumeUrl,
        description: 'Open the latest resume, role history, and skill summary.',
      }
    : null,
].filter(Boolean) as Array<{
  label: string;
  value: string;
  href: string;
  description: string;
}>;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-14 max-w-2xl">
        <span className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          Contact
        </span>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
          Let&apos;s talk about a role, contract, or product build.
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          Use the channels below to reach out. If you are hiring or scoping a project, the email link opens with a prefilled inquiry template to speed things up.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {contactChannels.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.label === 'Email' ? undefined : '_blank'}
            rel={channel.label === 'Email' ? undefined : 'noopener noreferrer'}
            className="rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/70 dark:hover:border-zinc-700"
          >
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{channel.label}</div>
            <div className="mb-3 break-all text-lg font-semibold text-zinc-900 dark:text-zinc-50">{channel.value}</div>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{channel.description}</p>
          </a>
        ))}
      </div>

      {!contactChannels.length ? (
        <div className="rounded-[1.75rem] border border-dashed border-zinc-300 px-6 py-10 text-center text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Add `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_GITHUB_URL`, or `NEXT_PUBLIC_RESUME_URL` to enable contact options.
        </div>
      ) : null}

      <section className="mt-14 rounded-[1.75rem] border border-zinc-200/80 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">What to include</div>
        <ul className="space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          <li>Role or project type</li>
          <li>Expected timeline</li>
          <li>Team or company context</li>
          <li>Budget, compensation, or engagement model</li>
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/projects"
          className="inline-flex items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          View Projects
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
