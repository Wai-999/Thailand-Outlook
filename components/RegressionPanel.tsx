import type { OLSResult } from '@/lib/stats';

type RegressionPanelProps = {
  outcomeLabel: string;
  predictorLabel: string;
  fit: OLSResult;
  /** One-sentence, plain-language reading of the slope's direction and size. */
  interpretation: string;
};

function fitQualityLabel(rSquared: number): string {
  if (rSquared >= 0.6) return 'strong -- this predictor explains most of the year-to-year movement';
  if (rSquared >= 0.35) return 'moderate -- this predictor explains a meaningful share, but other forces matter too';
  if (rSquared >= 0.15) return 'modest -- this predictor adds some signal, but most of the movement comes from elsewhere';
  return 'weak -- year-to-year swings are dominated by factors this single predictor does not capture';
}

/**
 * Shows a single-predictor OLS fit "with its work showing": the equation,
 * fit quality, a plain-language interpretation, and the standard caveats
 * the spec requires (assumptions + limitations) so a reader never sees a
 * bare number without context.
 */
export default function RegressionPanel({ outcomeLabel, predictorLabel, fit, interpretation }: RegressionPanelProps) {
  const sign = fit.slope >= 0 ? '+' : '−';
  return (
    <div className="flex flex-col gap-4 text-sm leading-relaxed text-ink-muted">
      <div className="rounded-xl border border-[var(--glass-border)] bg-white/40 p-4 font-mono text-[13px] text-ink">
        {outcomeLabel} &asymp; {fit.intercept.toFixed(2)} {sign} {Math.abs(fit.slope).toFixed(3)} &times; ({predictorLabel})
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Slope" value={fit.slope.toFixed(3)} />
        <Stat label="Intercept" value={fit.intercept.toFixed(2)} />
        <Stat label="R²" value={fit.rSquared.toFixed(2)} />
        <Stat label="Years used" value={String(fit.n)} />
      </div>
      <p>
        <strong className="text-ink">What the slope says: </strong>
        {interpretation}
      </p>
      <p>
        <strong className="text-ink">How well it fits: </strong>
        R² of {fit.rSquared.toFixed(2)} is {fitQualityLabel(fit.rSquared)}.
      </p>
      <p className="text-xs text-ink-soft">
        <strong className="text-ink-muted">Assumptions &amp; limits: </strong>
        this is a simple one-predictor regression on {fit.n} annual observations -- it assumes a
        straight-line relationship and does not control for other forces acting at the same time.
        A relationship here is evidence worth weighing, not proof of cause and effect.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--glass-border)] bg-white/30 px-3 py-2">
      <p className="font-label text-[10px] font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="font-display mt-0.5 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
