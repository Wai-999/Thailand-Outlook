'use client';

import { pearson, correlationStrength } from '@/lib/stats';

type MatrixSeries = {
  label: string;
  values: number[];
};

/**
 * Small Pearson-correlation grid. Cells are colour-coded by sign and
 * strength so a reader can scan for "moves together" / "moves opposite"
 * patterns at a glance -- the underlying numbers are always shown too,
 * so nothing is hidden behind the colour.
 */
export default function CorrelationMatrix({ series }: { series: MatrixSeries[] }) {
  const n = series.length;
  const matrix: (number | null)[][] = series.map((row) =>
    series.map((col) => pearson(row.values, col.values)),
  );

  function cellStyle(r: number | null): { background: string; color: string } {
    if (r === null) return { background: 'transparent', color: 'var(--ink-soft)' };
    const a = Math.min(1, Math.abs(r));
    if (r > 0) {
      return { background: `rgba(73, 106, 104, ${0.12 + a * 0.55})`, color: a > 0.55 ? '#fff' : 'var(--ink)' };
    }
    return { background: `rgba(201, 36, 43, ${0.1 + a * 0.45})`, color: a > 0.55 ? '#fff' : 'var(--ink)' };
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="p-2 text-left font-label font-medium text-ink-soft"> </th>
            {series.map((s) => (
              <th key={s.label} className="p-2 text-center font-label font-medium text-ink-muted">
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series.map((row, i) => (
            <tr key={row.label}>
              <th scope="row" className="whitespace-nowrap p-2 text-left font-label font-medium text-ink-muted">
                {row.label}
              </th>
              {series.map((col, j) => {
                const r = matrix[i][j];
                const style = cellStyle(r);
                return (
                  <td
                    key={col.label}
                    className="rounded-md p-2 text-center font-medium tabular-nums"
                    style={style}
                    title={
                      r === null
                        ? 'Not enough overlapping data'
                        : `${row.label} vs. ${col.label}: r = ${r.toFixed(2)} (${correlationStrength(r)})`
                    }
                  >
                    {r === null ? '—' : r.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: 'rgba(73,106,104,0.55)' }} />
          Move together (positive)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ background: 'rgba(201,36,43,0.45)' }} />
          Move opposite (negative)
        </span>
        <span>Darker = stronger relationship. {n}×{n} grid, Pearson&rsquo;s r on year-over-year readings.</span>
      </div>
    </div>
  );
}
