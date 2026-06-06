import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// ---------------------------------------------------------------------------
// Paths — resolved at request time so Next.js can't statically analyse and
// expose them. Never returned to the client.
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(process.cwd(), 'public', 'data', 'user');

function csvPath(dataset: string): string | null {
  if (dataset === 'macro') return path.join(DATA_DIR, 'thailand_macro.csv');
  if (dataset === 'micro') return path.join(DATA_DIR, 'thailand_micro.csv');
  return null;
}

// ---------------------------------------------------------------------------
// CSV parsing — minimal, no external dependency
// ---------------------------------------------------------------------------

/** Split a single CSV line respecting quoted fields. */
function splitLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuote = !inQuote; }
    } else if (ch === ',' && !inQuote) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

type ParsedCSV = {
  headers: string[];
  rows: string[][];          // raw rows (including blank/header rows)
  yearColumns: string[];
  sectors: string[];
  dataRows: {
    rowIndex: number;        // index in `rows`
    sector: string;
    indicatorCode: string;   // macro: col[1]; micro: col[1] (Indicator text)
    indicatorName: string;
    unit: string;
    values: Record<string, string>;
    rowKey: string;
  }[];
};

function parseCSV(filePath: string, dataset: 'macro' | 'micro'): ParsedCSV | null {
  let raw: string;
  try { raw = fs.readFileSync(filePath, 'utf-8'); }
  catch { return null; }

  const lines = raw.split(/\r?\n/);
  if (!lines.length) return null;
  const headers = splitLine(lines[0]);
  const rows = lines.map((l) => splitLine(l));

  // Identify year columns — 4-digit strings in the header row
  const yearColumns = headers.filter((h) => /^\d{4}$/.test(h));

  const sectorSet = new Set<string>();
  const dataRows: ParsedCSV['dataRows'] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.every((c) => !c.trim())) continue; // blank row

    let sector: string;
    let indicatorCode: string;
    let indicatorName: string;
    let unit: string;

    if (dataset === 'macro') {
      // Macro: Sector, Indicator Code, Indicator Name, Unit, ...
      sector = row[0]?.trim() ?? '';
      indicatorCode = row[1]?.trim() ?? '';
      indicatorName = row[2]?.trim() ?? '';
      unit = row[3]?.trim() ?? '';
    } else {
      // Micro: Sector, Indicator, Unit, Grade, Source, ...
      sector = row[0]?.trim() ?? '';
      indicatorCode = row[1]?.trim() ?? '';  // use Indicator text as code
      indicatorName = row[1]?.trim() ?? '';
      unit = row[2]?.trim() ?? '';
    }

    if (!indicatorCode) continue; // metadata-only row

    const values: Record<string, string> = {};
    for (const yr of yearColumns) {
      const colIdx = headers.indexOf(yr);
      values[yr] = colIdx >= 0 ? (row[colIdx]?.trim() ?? '') : '';
    }

    const rowKey = `${sector}||${indicatorCode}`;
    if (sector) sectorSet.add(sector);

    dataRows.push({ rowIndex: i, sector, indicatorCode, indicatorName, unit, values, rowKey });
  }

  return { headers, rows, yearColumns, sectors: [...sectorSet].sort(), dataRows };
}

// ---------------------------------------------------------------------------
// GET /api/user-data?dataset=macro&sector=...
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dataset = searchParams.get('dataset') ?? 'macro';
  const sectorFilter = searchParams.get('sector') ?? '';

  const filePath = csvPath(dataset);
  if (!filePath) return NextResponse.json({ error: 'Unknown dataset', rows: [] }, { status: 400 });

  const parsed = parseCSV(filePath, dataset as 'macro' | 'micro');
  if (!parsed) {
    return NextResponse.json({
      error: `Data file not found. Expected file at public/data/user/${dataset === 'macro' ? 'thailand_macro.csv' : 'thailand_micro.csv'}`,
      rows: [],
      sectors: [],
      yearColumns: [],
      dataset,
    });
  }

  const filteredRows = sectorFilter
    ? parsed.dataRows.filter((r) => r.sector === sectorFilter)
    : parsed.dataRows;

  return NextResponse.json({
    rows: filteredRows,
    sectors: parsed.sectors,
    yearColumns: parsed.yearColumns,
    dataset,
  });
}

// ---------------------------------------------------------------------------
// PATCH /api/user-data
// Body: { dataset, rowKey, year, newValue }
// ---------------------------------------------------------------------------
export async function PATCH(req: NextRequest) {
  let body: { dataset?: string; rowKey?: string; year?: string; newValue?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  const { dataset, rowKey, year, newValue } = body;

  // Validation
  if (!dataset || !rowKey || !year || newValue === undefined || newValue === null) {
    return NextResponse.json({ error: 'Missing required fields: dataset, rowKey, year, newValue' }, { status: 400 });
  }
  if (!/^\d{4}$/.test(year)) {
    return NextResponse.json({ error: 'year must be a 4-digit string' }, { status: 400 });
  }
  if (typeof newValue !== 'string' || newValue.trim() === '') {
    return NextResponse.json({ error: 'newValue must be a non-empty string' }, { status: 400 });
  }

  const filePath = csvPath(dataset);
  if (!filePath) return NextResponse.json({ error: 'Unknown dataset' }, { status: 400 });

  const parsed = parseCSV(filePath, dataset as 'macro' | 'micro');
  if (!parsed) return NextResponse.json({ error: 'Data file not found' }, { status: 404 });

  // Find the target row by rowKey
  const target = parsed.dataRows.find((r) => r.rowKey === rowKey);
  if (!target) return NextResponse.json({ error: `Row not found: ${rowKey}` }, { status: 404 });

  // Find the year column index
  const colIdx = parsed.headers.indexOf(year);
  if (colIdx === -1) return NextResponse.json({ error: `Year column not found: ${year}` }, { status: 404 });

  // Mutate the in-memory row, then rewrite the CSV preserving column order
  const rowToMutate = parsed.rows[target.rowIndex];
  // Extend row if shorter than headers
  while (rowToMutate.length < parsed.headers.length) rowToMutate.push('');
  rowToMutate[colIdx] = newValue.trim();

  // Serialize back — quote fields that contain commas or quotes
  function escapeCell(v: string): string {
    if (v.includes(',') || v.includes('"') || v.includes('\n')) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  }

  const csvOut = parsed.rows.map((row) => row.map(escapeCell).join(',')).join('\n');
  try {
    fs.writeFileSync(filePath, csvOut, 'utf-8');
  } catch (e) {
    return NextResponse.json({ error: 'Failed to write file. Check filesystem permissions.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
