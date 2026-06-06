import type { ReactNode } from 'react';
import { Hammer } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import SourceBadge from '@/components/SourceBadge';
import type { IndicatorSeries } from '@/lib/types';
import { latestPoint, formatValue } from '@/lib/data';

/**
 * Shared shell for the six "soon" nav destinations. Rather than a bare
 * "coming soon" wall, each placeholder states plainly that the page isn't
 * built yet, previews the questions it will eventually answer, and -- where
 * the underlying data already exists in this dataset -- surfaces one real,
 * live-computed figure as a taste of what the finished page will show.
 * Where no such data exists yet, that gap is named honestly rather than
 * faked with a placeholder number.
 */
export default function ComingSoonPage({
  eyebrow,
  title,
  blurb,
  plannedQuestions,
  preview,
  dataGap,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
  plannedQuestions: string[];
  preview?: { label: string; series: IndicatorSeries; note: ReactNode };
  dataGap?: ReactNode;
}) {
  const point = preview ? latestPoint(preview.series) : null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 pb-16">
      <header className="max-w-3xl">
        <p className="font-label text-xs font-semibold uppercase tracking-wide text-secondary">{eyebrow}</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-ink md:text-[2.5rem]">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">{blurb}</p>
      </header>

      <div className="glass-card flex items-start gap-3 border-secondary-soft bg-secondary-soft/30 px-4 py-3 md:px-5">
        <Hammer size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-secondary" />
        <p className="text-sm leading-relaxed text-ink-muted">
          <span className="font-semibold text-secondary">Not built yet — </span>
          This page is on the build list but isn&rsquo;t live. What follows is a preview of what
          it&rsquo;s meant to answer, plus -- where the data already exists -- one real number
          to show the kind of thing it will eventually surface in full.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-label text-sm font-semibold uppercase tracking-wide text-ink">
          The questions this page is meant to answer
        </h2>
        <ul className="flex flex-col gap-2.5">
          {plannedQuestions.map((q) => (
            <li key={q} className="glass-card flex items-start gap-3 px-4 py-3 text-sm leading-relaxed text-ink-muted">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
              {q}
            </li>
          ))}
        </ul>
      </section>

      {preview && point && (
        <section className="flex flex-col gap-4">
          <h2 className="font-label text-sm font-semibold uppercase tracking-wide text-ink">A preview, from real data already on hand</h2>
          <GlassCard>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-ink-muted">{preview.label}</p>
                <p className="font-display mt-1 text-3xl font-bold text-ink md:text-4xl">
                  {formatValue(point.value, preview.series.unit)}
                </p>
                <p className="mt-1 text-xs text-ink-soft">Latest available: {point.date.slice(0, 4)}</p>
              </div>
              <SourceBadge sourceName={preview.series.sourceName} sourceUrl={preview.series.sourceUrl} reliability="secondary" compact />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{preview.note}</p>
          </GlassCard>
        </section>
      )}

      {dataGap && (
        <section className="flex flex-col gap-4">
          <h2 className="font-label text-sm font-semibold uppercase tracking-wide text-ink">An honest gap</h2>
          <div className="glass-card px-5 py-4 text-sm leading-relaxed text-ink-muted">{dataGap}</div>
        </section>
      )}
    </div>
  );
}
