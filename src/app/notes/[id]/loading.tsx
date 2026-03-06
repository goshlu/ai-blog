export default function NoteDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-10 h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

      <article>
        <header className="mb-10 space-y-4">
          <div className="h-10 w-4/5 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex flex-wrap gap-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-5 w-20 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        </header>

        <div className="mb-14 space-y-3">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className={`h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900 ${index % 4 === 0 ? 'w-4/5' : 'w-full'}`}
            />
          ))}
        </div>

        <div className="rounded-[1.75rem] border border-zinc-100 bg-white/90 px-4 py-5 dark:border-zinc-800/80 dark:bg-[#05060a]/95 md:px-6 md:py-6">
          <div className="mb-4 h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
