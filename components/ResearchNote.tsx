import type { ReactNode } from 'react';
import { Lightbulb } from 'lucide-react';

/**
 * A styled callout for interpretive commentary -- the place where the
 * dashboard explains *why a chart matters*, not just what it shows.
 * Keep language careful: "evidence suggests", "a possible pathway is",
 * never flat causal claims (see CLAUDE_EFFICIENT.md voice rules).
 */
export default function ResearchNote({ title = 'Reading this chart', children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[var(--radius-md)] border border-primary-soft bg-primary-soft/40 px-4 py-3 text-sm text-ink-muted">
      <Lightbulb size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">{title}</p>
        <div className="leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0">{children}</div>
      </div>
    </div>
  );
}
