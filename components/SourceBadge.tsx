import { ExternalLink, ShieldCheck, Globe, FileQuestion, FlaskConical } from 'lucide-react';
import clsx from 'clsx';
import type { Reliability } from '@/lib/types';

const RELIABILITY_META: Record<Reliability, { label: string; icon: typeof ShieldCheck; tone: string }> = {
  official: { label: 'Official source', icon: ShieldCheck, tone: 'text-success' },
  international: { label: 'International body', icon: Globe, tone: 'text-primary' },
  secondary: { label: 'Secondary / compiled', icon: FileQuestion, tone: 'text-secondary' },
  demo: { label: 'Demo dataset', icon: FlaskConical, tone: 'text-accent-plum' },
};

export default function SourceBadge({
  sourceName,
  sourceUrl,
  reliability = 'secondary',
  compact = false,
}: {
  sourceName: string;
  sourceUrl?: string;
  reliability?: Reliability;
  compact?: boolean;
}) {
  const meta = RELIABILITY_META[reliability];
  const Icon = meta.icon;

  const content = (
    <span
      className={clsx(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border border-glass-border bg-surface-strong px-2.5 py-1 text-xs',
        meta.tone,
      )}
      title={`${meta.label}: ${sourceName}`}
    >
      <Icon size={13} strokeWidth={2} className="shrink-0" />
      <span className="truncate text-ink-muted">{compact ? meta.label : sourceName}</span>
      {sourceUrl && <ExternalLink size={11} className="shrink-0 opacity-60" />}
    </span>
  );

  if (sourceUrl) {
    return (
      <a href={sourceUrl} target="_blank" rel="noreferrer noopener" className="inline-block max-w-full">
        {content}
      </a>
    );
  }
  return content;
}
