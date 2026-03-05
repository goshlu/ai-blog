interface CalloutProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}

const typeStyles: Record<
  NonNullable<CalloutProps['type']>,
  { badge: string; container: string }
> = {
  info: {
    badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-300',
    container:
      'border-sky-100/80 bg-sky-50/60 dark:border-sky-900/60 dark:bg-sky-950/40',
  },
  success: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    container:
      'border-emerald-100/80 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/40',
  },
  warning: {
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
    container:
      'border-amber-100/80 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/40',
  },
  danger: {
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
    container:
      'border-rose-100/80 bg-rose-50/60 dark:border-rose-900/60 dark:bg-rose-950/40',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const style = typeStyles[type];

  return (
    <div
      className={[
        'my-4 rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm',
        style.container,
      ].join(' ')}
    >
      {title ? (
        <div className="mb-1.5 flex items-center gap-2">
          <span
            className={[
              'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
              style.badge,
            ].join(' ')}
          >
            {title}
          </span>
        </div>
      ) : null}
      <div className="text-zinc-700 dark:text-zinc-200">{children}</div>
    </div>
  );
}

