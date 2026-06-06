// Standard data schemas for Thailand Outlook.
// These shapes are the contract every page, chart, and stats routine
// builds on -- keep them stable; extend rather than mutate.

export type Frequency = 'daily' | 'monthly' | 'quarterly' | 'annual';

export type IndicatorPoint = {
  country: 'THA';
  indicatorCode: string;
  indicatorName: string;
  value: number;
  unit: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  frequency: Frequency;
  sourceName: string;
  sourceUrl?: string;
  isDemo: boolean;
};

export type AccessMethod = 'api' | 'csv' | 'manual' | 'pdf';
export type Reliability = 'official' | 'international' | 'secondary' | 'demo';

export type SourceMeta = {
  sourceName: string;
  publisher: string;
  updateFrequency: string;
  accessMethod: AccessMethod;
  reliability: Reliability;
};

// A named, queryable slice of the macro/micro datasets -- one series
// per (sector, indicator) pair, used by charts and the stats engine.
export type IndicatorSeries = {
  sector: string;
  indicatorCode: string;
  indicatorName: string;
  unit: string;
  frequency: Frequency;
  sourceName: string;
  sourceUrl?: string;
  isDemo: boolean;
  points: { date: string; value: number }[];
};

export type DatasetBundle = {
  generatedAt: string;
  sourceFile: string;
  sourceName: string;
  isDemo: boolean;
  sectors: string[];
  indicators: { code: string; name: string; unit: string; sector: string }[];
  series: IndicatorSeries[];
};
