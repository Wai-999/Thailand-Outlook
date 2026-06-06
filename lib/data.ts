import macroBundle from '@/public/data/macro.json';
import microBundle from '@/public/data/micro.json';
import sourceRegistry from '@/public/data/sources.json';
import type { DatasetBundle, IndicatorSeries, SourceMeta } from './types';

// Cast the static JSON imports to our schema once, at the edge.
export const macro = macroBundle as unknown as DatasetBundle;
export const micro = microBundle as unknown as DatasetBundle;
export const sources = sourceRegistry as unknown as SourceMeta[];

export const allBundles: DatasetBundle[] = [macro, micro];

export function allSeries(): IndicatorSeries[] {
  return [...macro.series, ...micro.series];
}

export function findSeries(indicatorCode: string): IndicatorSeries | undefined {
  return allSeries().find((s) => s.indicatorCode === indicatorCode);
}

export function seriesBySector(sector: string): IndicatorSeries[] {
  return allSeries().filter((s) => s.sector === sector);
}

export function latestPoint(series: IndicatorSeries) {
  return series.points[series.points.length - 1];
}

export function pointAtYear(series: IndicatorSeries, year: number) {
  return series.points.find((p) => p.date.startsWith(String(year)));
}

export function yoyChange(series: IndicatorSeries): number | null {
  const n = series.points.length;
  if (n < 2) return null;
  const last = series.points[n - 1].value;
  const prev = series.points[n - 2].value;
  if (prev === 0) return null;
  return ((last - prev) / Math.abs(prev)) * 100;
}

/** Format a value with its unit in a compact, research-readable way. */
export function formatValue(value: number, unit: string): string {
  const abs = Math.abs(value);
  let formatted: string;
  if (abs >= 1000) formatted = value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  else if (abs >= 100) formatted = value.toFixed(1);
  else formatted = value.toFixed(2);

  if (/^%/.test(unit) || /percent/i.test(unit)) return `${formatted}%`;
  if (/usd billion/i.test(unit)) return `$${formatted}B`;
  if (/thousand/i.test(unit)) return `${formatted}K`;
  return `${formatted} ${unit}`;
}

export function freshnessLabel(series: IndicatorSeries): string {
  const last = latestPoint(series);
  if (!last) return 'No data';
  const year = last.date.slice(0, 4);
  return `Latest: ${year}`;
}
