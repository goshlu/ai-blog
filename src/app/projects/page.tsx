import Link from 'next/link';
import { projects } from '@/lib/projects';

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-16 max-w-3xl">
        <span className="mb-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
          Projects
        </span>
        <h1 className="mb-5 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
          Selected work for hiring and client review.
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          This page collects product work, engineering systems, and portfolio-ready deliverables. Each entry includes scope, stack, and direct links so recruiters and clients can evaluate quickly.
        </p>
      </header>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <article
            key={project.slug}
            className="overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.10)] dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
          >
            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="p-8 md:p-10">
                <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-900">{project.status}</span>
                  <span>{project.period}</span>
                  <span>#{String(index + 1).padStart(2, '0')}</span>
                </div>

                <h2 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-3xl">
                  {project.name}
                </h2>
                <p className="mb-4 text-base text-zinc-600 dark:text-zinc-300">{project.summary}</p>
                <p className="mb-6 max-w-3xl leading-7 text-zinc-500 dark:text-zinc-400">{project.description}</p>

                <div className="mb-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Role</div>
                    <div className="text-sm text-zinc-700 dark:text-zinc-200">{project.role}</div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.links.map((link) => (
                    <a
                      key={link.href + link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                    >
                      {link.label}
                    </a>
                  ))}
                  {project.links.length === 0 ? (
                    <span className="inline-flex items-center rounded-full border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                      Add a live demo or repository link in `src/lib/projects.ts`
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-zinc-200/80 bg-gradient-to-br from-zinc-50 to-white p-8 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900 lg:border-l lg:border-t-0 md:p-10">
                <div className="mb-6">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Key Highlights</div>
                  <ul className="space-y-3">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 text-sm leading-6 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-300">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.metrics && project.metrics.length > 0 ? (
                  <div>
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Delivery Snapshot</div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {project.metrics.map((metric) => (
                        <div key={metric} className="rounded-2xl bg-zinc-900 px-4 py-5 text-sm font-medium text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-[2rem] border border-dashed border-zinc-300 px-8 py-10 text-center dark:border-zinc-700">
        <h2 className="mb-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Need a tailored case study?</h2>
        <p className="mx-auto mb-6 max-w-2xl text-zinc-600 dark:text-zinc-300">
          You can expand this portfolio by editing `src/lib/projects.ts` and adding screenshots, commercial case studies, or private project summaries with sanitized details.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Learn more about YSKM
        </Link>
      </section>
    </div>
  );
}
