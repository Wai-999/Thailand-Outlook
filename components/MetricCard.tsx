import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import clsx from 'clsx';
import type { IndicatorSeries } from '@/lib/types';
import { latestPoint, yoyChange, formatValue } from '@/lib/data';
import SourceBadge from './SourceBadge';
import DataFreshnessBadge from './DataFreshnessBadge';

/**
 * The core "headline number" card: value, unit, period-over-period
 * change, and where it came from -- always visible together so a
 * number is never shown without its provenance.
 */
export default function MetricCard({
  series,
  label,
  goodDirection = 'up',
  reliability = 'secondary',
}: {
  series: IndicatorSeries;
  /** Override the displayed label (defaults to the indicator name). */
  label?: string;
  /** Whether a rising value should read as positive ('up') or negative ('down'/'neutral'). */
  goodDirection?: 'up' | 'down' | 'neutral';
  reliability?: 'official' | 'international' | 'secondary' | 'demo';
}) {
  const latest = latestPoint(series);
  const change = yoyChange(series);
  const year = latest?.date.slice(0, 4);

  let changeTone = 'text-ink-soft';
  let ChangeIcon = Minus;
  if (change !== null && Math.abs(change) >= 0.05) {
    const rising = change > 0;
    ChangeIcon = rising ? ArrowUpRight : ArrowDownRight;
    const positive = goodDirection === 'neutral' ? null : rising === (goodDirection === 'up');
    changeTone = positive === null ? 'text-ink-muted' : positive ? 'text-success' : 'text-danger';
  }

  return (
    <div className="glass-card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
          {label ?? series.indicatorName}
        </p>
        {year && <span className="shrink-0 text-[11px] text-ink-soft">{year}</span>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-ink md:text-3xl">
          {latest ? formatValue(latest.value, series.unit) : '—'}
        </span>
        {change !== null && (
          <span className={clsx('inline-flex items-center gap-0.5 text-xs font-medium', changeTone)}>
            <ChangeIcon size={14} strokeWidth={2.25} />
            {Math.abs(change).toFixed(1)}% YoY
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <DataFreshnessBadge series={series} />
        <SourceBadge sourceName={series.sourceName} sourceUrl={series.sourceUrl} reliability={reliability} compact />
      </div>
    </div>
  );
}
