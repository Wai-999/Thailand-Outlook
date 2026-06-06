// Statistical engine -- small, dependency-free routines for descriptive
// stats, correlation (incl. lag), OLS regression, a simple risk score,
// and naive time-series forecasting. Kept transparent on purpose: every
// function returns the inputs/assumptions it used so the UI can show its
// work (per the "show interpretation, assumptions, limitations" rule).

export type DescriptiveStats = {
  n: number;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  latest: number;
};

export function describe(values: number[]): DescriptiveStats | null {
  if (!values.length) return null;
  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, n - 1);
  const median =
    n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[(n - 1) / 2];
  return {
    n,
    mean,
    median,
    stdDev: Math.sqrt(variance),
    min: sorted[0],
    max: sorted[n - 1],
    latest: values[values.length - 1],
  };
}

/** Pearson correlation between two equal-length numeric arrays. */
export function pearson(x: number[], y: number[]): number | null {
  const n = Math.min(x.length, y.length);
  if (n < 3) return null;
  const xs = x.slice(0, n);
  const ys = y.slice(0, n);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const ax = xs[i] - mx;
    const ay = ys[i] - my;
    num += ax * ay;
    dx += ax * ax;
    dy += ay * ay;
  }
  const denom = Math.sqrt(dx * dy);
  if (denom === 0) return null;
  return num / denom;
}

/**
 * Lag correlation: correlates x[t] with y[t+lag]. A positive `lag` asks
 * "does x today line up with y `lag` periods later?" -- useful for
 * leading-indicator style questions (e.g. does investment lead GDP?).
 */
export function lagCorrelation(x: number[], y: number[], lag: number): number | null {
  if (lag === 0) return pearson(x, y);
  if (lag > 0) {
    const xs = x.slice(0, x.length - lag);
    const ys = y.slice(lag);
    return pearson(xs, ys);
  }
  const k = -lag;
  const xs = x.slice(k);
  const ys = y.slice(0, y.length - k);
  return pearson(xs, ys);
}

export function correlationStrength(r: number | null): string {
  if (r === null) return 'insufficient data';
  const a = Math.abs(r);
  if (a >= 0.8) return 'very strong';
  if (a >= 0.6) return 'strong';
  if (a >= 0.4) return 'moderate';
  if (a >= 0.2) return 'weak';
  return 'negligible';
}

export type OLSResult = {
  slope: number;
  intercept: number;
  rSquared: number;
  n: number;
  predict: (x: number) => number;
};

/** Simple ordinary-least-squares regression of y on x. */
export function ols(x: number[], y: number[]): OLSResult | null {
  const n = Math.min(x.length, y.length);
  if (n < 3) return null;
  const xs = x.slice(0, n);
  const ys = y.slice(0, n);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  if (sxx === 0) return null;
  const slope = sxy / sxx;
  const intercept = my - slope * mx;

  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept;
    ssRes += (ys[i] - pred) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  const rSquared = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared, n, predict: (x0: number) => slope * x0 + intercept };
}

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high';

export type RiskScore = {
  score: number; // 0-100, higher = more risk
  level: RiskLevel;
  drivers: { label: string; contribution: number; note: string }[];
};

/**
 * A transparent, additive risk score (0-100). Each driver contributes a
 * bounded number of points based on simple, named rules -- intentionally
 * legible rather than a black box. This is a heuristic screening tool,
 * not a predictive model.
 */
export function buildRiskScore(drivers: { label: string; contribution: number; note: string }[]): RiskScore {
  const score = Math.max(0, Math.min(100, drivers.reduce((a, d) => a + d.contribution, 0)));
  let level: RiskLevel = 'low';
  if (score >= 70) level = 'high';
  else if (score >= 45) level = 'elevated';
  else if (score >= 25) level = 'moderate';
  return { score: Math.round(score), level, drivers };
}

export type ForecastPoint = { date: string; value: number; isForecast: true };

/**
 * Naive linear-trend forecast: fits OLS on (index -> value) over the
 * trailing `lookback` points and projects forward `horizon` periods.
 * Deliberately simple and disclosed -- a placeholder for the richer
 * Forecast Lab model work described in the spec, not a final answer.
 */
export function linearTrendForecast(
  points: { date: string; value: number }[],
  horizon: number,
  lookback = 10,
): { history: { date: string; value: number }[]; forecast: ForecastPoint[]; model: OLSResult | null } {
  const tail = points.slice(-lookback);
  const xs = tail.map((_, i) => i);
  const ys = tail.map((p) => p.value);
  const model = ols(xs, ys);
  if (!model || !tail.length) return { history: points, forecast: [], model };

  const lastYear = Number(points[points.length - 1].date.slice(0, 4));
  const forecast: ForecastPoint[] = [];
  for (let h = 1; h <= horizon; h++) {
    const x0 = tail.length - 1 + h;
    forecast.push({
      date: `${lastYear + h}-01-01`,
      value: model.predict(x0),
      isForecast: true,
    });
  }
  return { history: points, forecast, model };
}
