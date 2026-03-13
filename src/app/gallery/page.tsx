import Link from 'next/link';
import { galleryItems } from '@/lib/gallery';

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-14 max-w-3xl">
        <span className="mb-4 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
          Gallery
        </span>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
          A few frames from the environment around the work.
        </h1>
        <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          This is a lightweight visual layer for the site: workspaces, objects, and moments that add texture beyond code and writing.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {galleryItems.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.10)] dark:border-zinc-800/80 dark:bg-zinc-950/70 dark:shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
          >
            <div
              className="h-72 bg-cover bg-center"
              style={{ backgroundImage: `url('${item.imageUrl}')` }}
            />
            <div className="p-6">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
                <span>{item.date}</span>
                <span>{item.location}</span>
              </div>
              <h2 className="mb-3 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                {item.title}
              </h2>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/notes"
          className="inline-flex items-center rounded-full border border-zinc-900 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Read Notes
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
