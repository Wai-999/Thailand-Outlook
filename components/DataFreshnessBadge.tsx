import { Clock3 } from 'lucide-react';
import type { IndicatorSeries } from '@/lib/types';
import { freshnessLabel } from '@/lib/data';

export default function DataFreshnessBadge({ series }: { series: IndicatorSeries }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-surface px-2.5 py-1 text-xs text-ink-soft">
      <Clock3 size={13} strokeWidth={2} />
      {freshnessLabel(series)}
      {series.frequency && <span className="text-ink-soft/70">· {series.frequency}</span>}
    </span>
  );
}
