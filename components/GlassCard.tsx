import type { ReactNode } from 'react';
import clsx from 'clsx';

export default function GlassCard({
  title,
  subtitle,
  action,
  footer,
  children,
  className,
  padded = true,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={clsx('glass-card flex flex-col', padded && 'p-5 md:p-6', className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h3 className="text-sm font-semibold text-ink md:text-base">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs text-ink-soft md:text-sm">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className="min-w-0 flex-1">{children}</div>
      {footer && <footer className="mt-4 border-t border-glass-border pt-3 text-xs text-ink-soft">{footer}</footer>}
    </section>
  );
}
