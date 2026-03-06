export default function PostDetailLoading() {
  return (
    <div className="mt-6 md:mt-10">
      <div className="mb-6 flex items-center justify-between gap-3 text-xs md:mb-8">
        <div className="h-8 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="hidden h-6 w-28 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900 md:block" />
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_240px] lg:items-start lg:gap-10 xl:gap-12">
        <article className="overflow-hidden rounded-[2rem] border border-zinc-100 bg-white/90 dark:border-zinc-800/80 dark:bg-[#05060a]/90">
          <div className="border-b border-zinc-100/80 px-5 pb-6 pt-7 dark:border-zinc-800/80 md:px-10 md:pt-9">
            <div className="mb-4 flex flex-wrap gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-7 w-20 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900" />
              ))}
            </div>
            <div className="mx-auto mb-3 h-9 w-4/5 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 md:h-11" />
            <div className="mx-auto h-6 w-2/5 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
          </div>

          <section className="border-b border-zinc-100/80 px-5 py-7 dark:border-zinc-800/80 md:px-10">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
              ))}
            </div>
          </section>

          <section className="px-5 py-8 md:px-10 md:py-10">
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className={`h-4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900 ${index % 3 === 0 ? 'w-5/6' : 'w-full'}`}
                />
              ))}
            </div>
          </section>
        </article>

        <aside className="hidden pt-2 lg:block">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/80 px-4 py-4 dark:border-zinc-800/80 dark:bg-zinc-950/60">
            <div className="mb-3 h-4 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-3.5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
