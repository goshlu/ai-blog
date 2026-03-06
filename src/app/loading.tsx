export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-16">
      <div className="mb-10 space-y-3">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-5 w-80 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-zinc-100 bg-white/90 p-6 dark:border-zinc-800/80 dark:bg-zinc-950/70"
          >
            <div className="mb-4 h-5 w-2/3 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
