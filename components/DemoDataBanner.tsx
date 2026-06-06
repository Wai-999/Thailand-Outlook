import { FlaskConical } from 'lucide-react';

/**
 * One banner per page (not per-card) flagging that the figures shown are
 * a static research snapshot rather than a live feed. Keep this single
 * and prominent -- per-card warnings get ignored ("banner blindness").
 */
export default function DemoDataBanner({
  note = 'Figures come from a compiled research snapshot (2005–2026, mostly annual). Recent years marked forecast/preliminary by the original compilers. Treat this as a starting point for inquiry, not a live feed.',
}: {
  note?: string;
}) {
  return (
    <div className="glass-card mb-6 flex items-start gap-3 border-secondary-soft bg-secondary-soft/35 px-4 py-3 md:px-5">
      <FlaskConical size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-secondary" />
      <p className="text-sm leading-relaxed text-ink-muted">
        <span className="font-semibold text-secondary">Static dataset notice — </span>
        {note}
      </p>
    </div>
  );
}
