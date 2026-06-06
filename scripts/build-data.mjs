// Converts the two raw Thailand datasets (wide-format CSVs, one row per
// indicator with year columns) into long-format JSON bundles the app can
// query quickly: public/data/macro.json, micro.json, sources.json.
//
// Run with: npm run build:data
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'data');
mkdirSync(OUT_DIR, { recursive: true });

// ---- minimal RFC4180 CSV parser (handles quoted fields, embedded commas,
// embedded newlines, and "" escaped quotes) -------------------------------
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '_');
}

function toNumber(raw) {
  if (raw == null) return null;
  const s = String(raw).trim().replace(/,/g, '');
  if (s === '' || s === '-' || s === '—' || s === 'n/a' || s === 'N/A') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function inferFrequency() {
  // Both source files are annual time series (one column per calendar year).
  return 'annual';
}

// ---- generic wide -> long converter --------------------------------------
function buildBundle({
  csvPath,
  sourceFile,
  sourceName,
  isDemo,
  sectorCol,
  nameCol,
  unitCol,
  sourceCol,
  sourceUrlCol,
  codeCol, // optional -- if absent, derive a slug from the indicator name
}) {
  const raw = readFileSync(csvPath, 'utf8');
  const rows = parseCSV(raw);
  const header = rows[0];
  const yearCols = [];
  header.forEach((h, idx) => {
    const trimmed = h.trim();
    if (/^(19|20)\d{2}$/.test(trimmed)) yearCols.push({ idx, year: trimmed });
  });

  const idx = (col) => header.findIndex((h) => h.trim().toLowerCase() === col.toLowerCase());
  const iSector = idx(sectorCol);
  const iName = idx(nameCol);
  const iUnit = idx(unitCol);
  const iSource = sourceCol ? idx(sourceCol) : -1;
  const iSourceUrl = sourceUrlCol ? idx(sourceUrlCol) : -1;
  const iCode = codeCol ? idx(codeCol) : -1;

  const series = [];
  const indicatorMap = new Map();
  const sectors = new Set();
  const seenCodes = new Set();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const sector = (row[iSector] || '').trim();
    const name = (row[iName] || '').trim();
    if (!sector || !name) continue; // skip blank separator / metadata rows
    if (/^GRADE KEY|^CORRECTIONS APPLIED/i.test(sector)) continue;

    const unit = (row[iUnit] || '').trim();
    const sourceName2 = iSource >= 0 ? (row[iSource] || '').trim() : sourceName;
    const sourceUrl = iSourceUrl >= 0 ? (row[iSourceUrl] || '').trim() || undefined : undefined;

    let code = iCode >= 0 ? (row[iCode] || '').trim() : '';
    if (!code) code = slugify(`${sector}_${name}`);
    let uniqueCode = code;
    let n = 2;
    while (seenCodes.has(uniqueCode)) uniqueCode = `${code}_${n++}`;
    seenCodes.add(uniqueCode);

    const points = [];
    for (const { idx: yIdx, year } of yearCols) {
      const value = toNumber(row[yIdx]);
      if (value === null) continue;
      points.push({ date: `${year}-01-01`, value });
    }
    if (!points.length) continue;

    sectors.add(sector);
    indicatorMap.set(uniqueCode, { code: uniqueCode, name, unit, sector });
    series.push({
      sector,
      indicatorCode: uniqueCode,
      indicatorName: name,
      unit,
      frequency: inferFrequency(),
      sourceName: sourceName2 || sourceName,
      sourceUrl,
      isDemo,
      points,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    sourceFile,
    sourceName,
    isDemo,
    sectors: Array.from(sectors).sort(),
    indicators: Array.from(indicatorMap.values()),
    series,
  };
}

const macro = buildBundle({
  csvPath: join(ROOT, 'data', 'raw', 'macro.csv'),
  sourceFile: 'thailand_macro_filled - thailand_macro_master_by_sector_2005_2026.csv.csv',
  sourceName: 'Thailand Macro Master Dataset (2005-2026)',
  isDemo: false,
  sectorCol: 'Sector',
  nameCol: 'Indicator Name',
  unitCol: 'Unit',
  sourceCol: 'Primary Source',
  sourceUrlCol: 'Source URL',
  codeCol: 'Indicator Code',
});

const micro = buildBundle({
  csvPath: join(ROOT, 'data', 'raw', 'micro.csv'),
  sourceFile: 'thailand_microeconomic_2005_2025 - Master Dataset.csv',
  sourceName: 'Thailand Microeconomic Master Dataset (2005-2025)',
  isDemo: false,
  sectorCol: 'Sector',
  nameCol: 'Indicator',
  unitCol: 'Unit',
  sourceCol: 'Source',
});

writeFileSync(join(OUT_DIR, 'macro.json'), JSON.stringify(macro, null, 2));
writeFileSync(join(OUT_DIR, 'micro.json'), JSON.stringify(micro, null, 2));

// ---- source registry (SourceMeta[]) used by the Data Sources page --------
const sources = [
  {
    sourceName: 'Thailand Macro Master Dataset (2005-2026)',
    publisher: 'Compiled from World Bank, Bank of Thailand, IMF/ADB, NESDC, NSO',
    updateFrequency: 'Static research snapshot (annual series, 2025-2026 forecast/preliminary)',
    accessMethod: 'csv',
    reliability: 'secondary',
  },
  {
    sourceName: 'Thailand Microeconomic Master Dataset (2005-2025)',
    publisher: 'Compiled from DBD, OSMEP, OIE, BOT, NSO, UNESCO/World Bank and others',
    updateFrequency: 'Static research snapshot (annual series)',
    accessMethod: 'csv',
    reliability: 'secondary',
  },
  {
    sourceName: 'World Bank Open Data',
    publisher: 'The World Bank Group',
    updateFrequency: 'Annual, with periodic revisions',
    accessMethod: 'api',
    reliability: 'international',
  },
  {
    sourceName: 'Bank of Thailand (BOT)',
    publisher: 'Bank of Thailand',
    updateFrequency: 'Monthly / quarterly statistical releases',
    accessMethod: 'manual',
    reliability: 'official',
  },
  {
    sourceName: 'NESDC / NSO / IMF / ADB (compiled)',
    publisher: 'Various national & international statistical agencies',
    updateFrequency: 'Varies by series (annual to quarterly)',
    accessMethod: 'manual',
    reliability: 'official',
  },
];
writeFileSync(join(OUT_DIR, 'sources.json'), JSON.stringify(sources, null, 2));

console.log(`macro.json  -> ${macro.series.length} series across ${macro.sectors.length} sectors`);
console.log(`micro.json  -> ${micro.series.length} series across ${micro.sectors.length} sectors`);
console.log(`sources.json -> ${sources.length} sources`);
