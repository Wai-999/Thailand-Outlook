'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import SourceBadge from '@/components/SourceBadge';
import { ShieldCheck, Globe, FileQuestion, FlaskConical, BookOpen, Calculator } from 'lucide-react';
import type { Reliability } from '@/lib/types';

const TABS = [
  { id: 'guide', label: 'Dashboard guide' },
  { id: 'methods', label: 'Technical methods' },
];

const SECTIONS = [
  { id: 'overview', label: 'Platform overview' },
  { id: 'data-guide', label: 'Reading the data' },
  { id: 'dashboard-guide', label: 'Using the dashboard' },
  { id: 'where-data-comes-from', label: 'Where the data comes from' },
  { id: 'source-credibility', label: 'Source credibility' },
  { id: 'glossary', label: 'Glossary' },
];

const METHOD_SECTIONS = [
  { id: 'descriptive', label: 'Descriptive statistics' },
  { id: 'correlation', label: 'Correlation & lag' },
  { id: 'regression', label: 'OLS regression' },
  { id: 'growth-rates', label: 'Growth rates & CAGR' },
  { id: 'risk-scoring', label: 'Risk scoring' },
  { id: 'forecasting', label: 'Linear trend forecast' },
  { id: 'derived-indicators', label: 'Derived indicators' },
];

const RELIABILITY_ROWS: { key: Reliability; icon: typeof ShieldCheck; tone: string; title: string; copy: string }[] = [
  {
    key: 'official',
    icon: ShieldCheck,
    tone: 'text-success',
    title: 'Official source',
    copy: 'Comes straight from the agency that owns the number — a central bank, a statistics office, a ministry.',
  },
  {
    key: 'international',
    icon: Globe,
    tone: 'text-primary',
    title: 'International body',
    copy: 'Comes from an institution like the World Bank, IMF, or ADB that standardizes national data for cross-country comparison — usually one step removed from the original publisher.',
  },
  {
    key: 'secondary',
    icon: FileQuestion,
    tone: 'text-secondary',
    title: 'Secondary / compiled',
    copy: 'Assembled or derived by someone other than the original publisher — a research desk, an industry body, or this project recombining official series into a new measure.',
  },
  {
    key: 'demo',
    icon: FlaskConical,
    tone: 'text-accent-plum',
    title: 'Demo dataset',
    copy: "Placeholder or synthetic figures, used only as a stand-in when a real feed isn't connected yet — fine for testing a layout, never for drawing conclusions. This dashboard doesn't currently carry any: every number traces back to a named source above.",
  },
];

const GLOSSARY: { term: string; definition: string }[] = [
  { term: 'GDP (Gross Domestic Product)', definition: 'The total value of everything a country produces in a given period. The single most-watched gauge of how big — and how fast-growing — an economy is.' },
  { term: 'YoY (Year-over-year)', definition: 'A comparison between a period and the same period one year earlier. Strips out seasonal noise so you can see the underlying trend.' },
  { term: 'Percentage point (pp)', definition: 'The plain difference between two percentages. If growth moves from 2% to 3%, that is a rise of one percentage point — not "a 50% increase," which would describe the relative change instead.' },
  { term: 'CPI (Consumer Price Index)', definition: 'A measure of how much a fixed basket of everyday goods and services costs over time. The standard way inflation gets tracked and reported.' },
  { term: 'Current account', definition: "The broadest scorecard of a country's transactions with the rest of the world — trade in goods and services, plus income and transfers. A surplus means more is coming in than going out." },
  { term: 'FDI (Foreign Direct Investment)', definition: 'Money that foreign individuals or companies invest directly into businesses or assets in a country, rather than through stock markets. Often read as a vote of confidence in the future.' },
  { term: 'NPL (Non-Performing Loan)', definition: 'A loan where the borrower has fallen significantly behind on payments. A rising NPL ratio is an early warning sign of stress in household or business balance sheets.' },
  { term: 'Policy rate', definition: 'The interest rate a central bank sets to influence borrowing costs across the whole economy — its main lever for cooling or warming up growth and inflation.' },
  { term: 'Pearson correlation (r)', definition: 'A number between −1 and 1 describing how closely two series move together in a straight-line sense. Close to 1 means they tend to rise together; close to −1 means one tends to fall as the other rises; close to 0 means little linear relationship. It says nothing about which one — if either — causes the other.' },
  { term: 'OLS regression', definition: 'Ordinary Least Squares — the most common way to fit a straight line through data and ask "how much does a change in one thing typically come with a change in another?" Produces a slope, an intercept, and a measure of fit (R²).' },
  { term: 'R² (R-squared)', definition: 'A number between 0 and 1 showing how much of the up-and-down movement in one series a model actually explains. Higher means a tighter fit — but a high R² still does not prove cause and effect.' },
  { term: 'Lag correlation', definition: 'A correlation measured after shifting one series forward or backward in time, used to ask whether one indicator tends to move ahead of — or behind — another.' },
  { term: 'Trade openness', definition: 'Total trade (exports plus imports) measured against the size of the economy. A high reading means the country is unusually exposed to swings in global demand.' },
  { term: 'Basis point (bp)', definition: 'One-hundredth of a percentage point. Interest-rate moves are often quoted this way — a "25 basis point hike" is a 0.25 percentage-point rise.' },
];

function NavCrumb({ id, label }: { id: string; label: string }) {
  return (
    <a
      href={`#${id}`}
      className="rounded-full border border-glass-border bg-surface-strong px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-primary/40 hover:text-primary"
    >
      {label}
    </a>
  );
}

function FormulaBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-2 overflow-x-auto rounded-lg border border-glass-border bg-surface-strong px-5 py-3.5 font-mono text-sm text-ink">
      {children}
    </div>
  );
}

function MethodSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-4 border-b border-glass-border pb-10">
      <h2 className="font-display text-xl font-semibold text-ink md:text-[1.4rem]">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-muted md:text-base">
        {children}
      </div>
    </section>
  );
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'guide' | 'methods'>('guide');

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 pb-20">
      <header className="max-w-3xl">
        <p className="font-label text-xs font-semibold uppercase tracking-wide text-secondary">How this dashboard works</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-ink md:text-[2.5rem]">Documentation</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
          One reference for how Thailand Outlook is built, how to read what it shows you,
          and exactly how every number and calculation is produced.
        </p>
      </header>

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-xl border border-glass-border bg-surface-strong p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'guide' | 'methods')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white shadow-sm text-ink'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.id === 'guide' ? <BookOpen size={14} /> : <Calculator size={14} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: DASHBOARD GUIDE ─── */}
      {activeTab === 'guide' && (
        <div className="flex flex-col gap-12">
          <nav className="flex flex-wrap gap-2" aria-label="Jump to section">
            {SECTIONS.map((s) => (
              <NavCrumb key={s.id} id={s.id} label={s.label} />
            ))}
          </nav>

          <section id="overview" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-[1.75rem]">Platform overview</h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-muted md:text-base">
              <p>
                Thailand Outlook is an independent research dashboard that tries to tell the story
                of the Thai economy honestly — with the numbers, the methods, and the uncertainty
                all visible at once. It is built around a simple idea: every chart should answer
                one clear question, every model should show its work, and every figure should say
                where it came from.
              </p>
              <p>
                The pages connect into a rough narrative arc. <strong className="text-ink">Command Center</strong> opens
                with the headline picture — is the economy improving, weakening, or mixed, and what
                changed most recently. <strong className="text-ink">Macro Outlook</strong> and <strong className="text-ink">Sector
                Intelligence</strong> dig into the forces driving that picture — growth, inflation, trade,
                and how individual industries are really doing. <strong className="text-ink">Statistical
                Engine</strong> and <strong className="text-ink">Forecast Lab</strong> turn from description to
                analysis: which indicators move together, what explains GDP growth, and what a
                transparent (if simple) baseline forecast looks like. <strong className="text-ink">Data
                Sources</strong> closes the loop by naming everything that fed into the rest.
              </p>
              <p>
                A handful of destinations in the sidebar are marked <span className="rounded-full bg-secondary-soft px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-secondary">soon</span> —
                they preview the questions they&rsquo;re meant to answer and are honest about what&rsquo;s
                missing rather than shipping empty shells.
              </p>
            </div>
          </section>

          <section id="data-guide" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-[1.75rem]">Reading the data</h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-muted md:text-base">
              <p>
                <strong className="text-ink">Units matter more than they look.</strong> A figure
                labeled &ldquo;% of GDP&rdquo; describes size relative to the whole economy; a figure
                labeled &ldquo;% Annual&rdquo; or &ldquo;YoY&rdquo; describes a rate of change. Mixing
                the two up is one of the easiest ways to misread an economic chart — when in doubt,
                check the unit shown next to the number.
              </p>
              <p>
                <strong className="text-ink">Percentage points vs. percent.</strong> When growth
                moves from 2% to 3%, this dashboard calls that a rise of <em>one percentage point</em>,
                not &ldquo;a 50% increase.&rdquo; Both are technically defensible ways to describe the
                same move, but they sound very different — this dashboard consistently uses
                percentage points for that reason.
              </p>
              <p>
                <strong className="text-ink">How forecasts are labeled.</strong> Anything produced by
                this dashboard&rsquo;s own models — a trend line, a projection, a scenario figure — is
                described in the surrounding text as a forecast or projection, never presented as a
                measurement. The Forecast Lab page goes further and shows the exact equation and
                assumptions behind every projected number.
              </p>
              <p>
                <strong className="text-ink">The demo-data notice.</strong> Most pages carry a banner
                explaining that the figures come from a compiled research snapshot rather than a
                live feed, and that the most recent year or two are often marked forecast or
                preliminary by the original compilers. That banner isn&rsquo;t boilerplate — it is the
                single most important thing to read before quoting a number from this dashboard
                elsewhere.
              </p>
            </div>
          </section>

          <section id="dashboard-guide" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-[1.75rem]">Using the dashboard</h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-muted md:text-base">
              <p>
                Navigation lives in the sidebar on the left (or behind the menu icon on smaller
                screens). You can collapse it to a slim icon rail with the arrow at the bottom if
                you&rsquo;d rather have more room for the charts themselves — that preference is
                remembered the next time you visit.
              </p>
              <p>
                Every chart and model panel is paired with plain-language notes — usually under a
                heading like &ldquo;Show the work&rdquo; or inside a research note — that explain what
                the numbers mean, what assumptions sit behind them, and what they don&rsquo;t prove.
                Reading those alongside the chart is the intended way to use this dashboard; the
                chart alone is only half the picture.
              </p>
              <p className="rounded-[var(--radius-sm)] border border-glass-border bg-surface-strong px-4 py-3 text-sm text-ink-muted">
                <strong className="text-ink">Worth knowing:</strong> filtering by date range, side-by-side
                comparison views, and automatic pattern detection are on the roadmap but are not part
                of this build yet. If you came looking for those, you&rsquo;re early — but the
                underlying data and statistical groundwork they would sit on top of are already here.
              </p>
            </div>
          </section>

          <section id="where-data-comes-from" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-[1.75rem]">Where the data comes from</h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-muted md:text-base">
              <p>
                Every indicator on this dashboard is compiled ahead of time into a static research
                snapshot — there is no live database connection and no in-app way to upload or edit
                figures. New data arrives by extending the underlying research datasets (drawn from
                the World Bank, Bank of Thailand, NESDC, NSO, and the other publishers named on the{' '}
                <Link href="/data-sources" className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">
                  Data Sources
                </Link>{' '}
                page) and rebuilding the dashboard on top of them — not by editing values in place.
              </p>
              <p>
                That keeps every number traceable to a named publisher and a stated update cadence,
                at the cost of not being real-time. The{' '}
                <Link href="/data-sources" className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary">Data Sources</Link>{' '}
                page is the right place to check exactly how current any given figure is before relying on it.
              </p>
            </div>
          </section>

          <section id="source-credibility" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-[1.75rem]">Source credibility</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
              Rather than collapsing source quality into a single letter grade, this dashboard
              tags every source with one of four descriptive labels — each one answers the same
              underlying question (how directly does this number trace back to an authoritative
              publisher?) while staying specific about what kind of source is actually behind it.
              You&rsquo;ll see these as small badges under charts and tables across the dashboard;
              hovering one always reveals the exact source name.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {RELIABILITY_ROWS.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.key} className="glass-card flex gap-3 p-4">
                    <Icon size={18} strokeWidth={1.75} className={`mt-0.5 shrink-0 ${r.tone}`} />
                    <div>
                      <div className="mb-1.5">
                        <SourceBadge sourceName={r.title} reliability={r.key} compact />
                      </div>
                      <p className="text-sm leading-relaxed text-ink-muted">{r.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section id="glossary" className="flex scroll-mt-24 flex-col gap-4">
            <h2 className="font-display text-2xl font-semibold text-ink md:text-[1.75rem]">Glossary</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
              Plain-language definitions for the terms that recur across this dashboard — economic
              shorthand on one side, statistical shorthand on the other.
            </p>
            <GlassCard padded={false} className="overflow-hidden">
              <dl className="divide-y divide-glass-border">
                {GLOSSARY.map((g) => (
                  <div key={g.term} className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[14rem_1fr] sm:gap-4">
                    <dt className="font-label text-sm font-semibold text-ink">{g.term}</dt>
                    <dd className="text-sm leading-relaxed text-ink-muted">{g.definition}</dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          </section>
        </div>
      )}

      {/* ─── TAB: TECHNICAL METHODS ─── */}
      {activeTab === 'methods' && (
        <div className="flex flex-col gap-10">
          <div className="max-w-2xl">
            <p className="text-sm leading-relaxed text-ink-muted md:text-base">
              Every calculation this dashboard performs is implemented in plain TypeScript with no
              external statistical library — so every formula can be read directly in the source
              code and every result can be reproduced with a spreadsheet. This page documents
              each method: what it computes, the exact formula used, why it was chosen, and what
              it cannot tell you.
            </p>
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="Jump to method">
            {METHOD_SECTIONS.map((s) => (
              <NavCrumb key={s.id} id={s.id} label={s.label} />
            ))}
          </nav>

          <div className="flex flex-col gap-10">

            {/* Descriptive statistics */}
            <MethodSection id="descriptive" title="Descriptive statistics">
              <p>
                <strong className="text-ink">Where applied:</strong> Statistical Engine — the summary
                statistics panel shown for each indicator (GDP growth, inflation, export growth, etc.).
              </p>
              <p>
                <strong className="text-ink">What it computes:</strong> for a series of <em>n</em> values,
                the dashboard calculates the sample mean, median, sample standard deviation, minimum,
                maximum, and most recent observed value.
              </p>
              <FormulaBlock>
                <div>Mean: x&#772; = (&#x3A3; x&#7522;) / n</div>
                <div className="mt-1">Median: middle value of sorted array (average of two middles when n is even)</div>
                <div className="mt-1">Std dev: s = &radic;[ &Sigma;(x&#7522; &minus; x&#772;)&sup2; / (n &minus; 1) ]</div>
              </FormulaBlock>
              <p>
                <strong className="text-ink">Why sample std dev (n &minus; 1):</strong> the data represents
                a sample of historical years, not a complete population. Using <em>n &minus; 1</em> (Bessel&rsquo;s
                correction) gives an unbiased estimate of the true population variance.
              </p>
              <p>
                <strong className="text-ink">Limitation:</strong> descriptive statistics summarize the
                historical distribution but say nothing about future behavior. A low standard deviation
                in GDP growth could reflect structural stability or a short, unrepresentative sample
                period — always check the time span alongside the stat.
              </p>
            </MethodSection>

            {/* Correlation */}
            <MethodSection id="correlation" title="Correlation & lag correlation">
              <p>
                <strong className="text-ink">Where applied:</strong> Statistical Engine — the correlation
                matrix and the lag-correlation panel exploring whether one indicator leads or follows another.
              </p>
              <p>
                <strong className="text-ink">What it computes:</strong> Pearson&rsquo;s <em>r</em>, which
                measures the strength and direction of the linear relationship between two series aligned
                on the same dates.
              </p>
              <FormulaBlock>
                <div>r = &Sigma;[(x&#7522; &minus; x&#772;)(y&#7522; &minus; y&#772;)] / &radic;[ &Sigma;(x&#7522; &minus; x&#772;)&sup2; &middot; &Sigma;(y&#7522; &minus; y&#772;)&sup2; ]</div>
                <div className="mt-2 text-ink-soft text-xs">
                  Range: &minus;1 (perfect inverse) to +1 (perfect positive).<br />
                  |r| &ge; 0.8 &rarr; very strong &nbsp;|&nbsp; &ge; 0.6 &rarr; strong &nbsp;|&nbsp; &ge; 0.4 &rarr; moderate &nbsp;|&nbsp; &ge; 0.2 &rarr; weak &nbsp;|&nbsp; &lt; 0.2 &rarr; negligible
                </div>
              </FormulaBlock>
              <p>
                <strong className="text-ink">Lag correlation</strong> shifts one series by <em>k</em> periods
                before computing Pearson&rsquo;s <em>r</em>. A positive lag of 1 asks: &ldquo;does the value
                of X today correlate with Y one year later?&rdquo; — the way a leading-indicator analysis
                would test whether private investment predicts future GDP growth.
              </p>
              <FormulaBlock>
                <div>lag_r(X, Y, k) = pearson( X[0..n&minus;k], Y[k..n] )&nbsp;&nbsp;&nbsp;for k &gt; 0</div>
                <div className="mt-1">lag_r(X, Y, k) = pearson( X[|k|..n], Y[0..n&minus;|k|] )&nbsp;&nbsp;&nbsp;for k &lt; 0</div>
              </FormulaBlock>
              <p>
                <strong className="text-ink">Critical limitation — correlation is not causation.</strong> A
                high <em>r</em> between investment growth and GDP growth does not mean investment causes
                GDP growth; both could be driven by a third factor such as global demand or commodity
                prices. The dashboard flags this explicitly under every correlation result. A minimum of
                3 aligned data points is required; fewer returns null.
              </p>
            </MethodSection>

            {/* OLS regression */}
            <MethodSection id="regression" title="OLS regression (ordinary least squares)">
              <p>
                <strong className="text-ink">Where applied:</strong> Statistical Engine — the regression
                panel quantifying how much of GDP growth is explained by private investment, household
                consumption, export growth, or tourism arrivals.
              </p>
              <p>
                <strong className="text-ink">What it computes:</strong> a bivariate OLS regression of
                GDP growth (Y) on a single predictor (X). The algorithm finds the slope and intercept
                that minimize the sum of squared residuals.
              </p>
              <FormulaBlock>
                <div>slope &beta; = &Sigma;[(x&#7522; &minus; x&#772;)(y&#7522; &minus; y&#772;)] / &Sigma;(x&#7522; &minus; x&#772;)&sup2;</div>
                <div className="mt-1">intercept &alpha; = y&#772; &minus; &beta; &middot; x&#772;</div>
                <div className="mt-1">Predicted: y&#770; = &alpha; + &beta; &middot; x</div>
                <div className="mt-2">R&sup2; = 1 &minus; SS<sub>res</sub> / SS<sub>tot</sub></div>
                <div className="text-ink-soft text-xs mt-1">SS<sub>res</sub> = &Sigma;(y&#7522; &minus; y&#770;&#7522;)&sup2;&nbsp;&nbsp;&nbsp;SS<sub>tot</sub> = &Sigma;(y&#7522; &minus; y&#772;)&sup2;</div>
              </FormulaBlock>
              <p>
                <strong className="text-ink">Reading the slope:</strong> a slope of 0.42 between
                export growth (X) and GDP growth (Y) means that historically, each extra percentage
                point of export growth has aligned with 0.42 extra percentage points of GDP growth in
                the same year. The dashboard always converts the slope to plain English in the
                interpretation panel below each regression.
              </p>
              <p>
                <strong className="text-ink">Reading R&sup2;:</strong> R&sup2; = 0.72 means the predictor
                explains 72% of the year-to-year variance in GDP growth in a statistical sense. It
                does not mean 72% of GDP growth is <em>caused</em> by that variable.
              </p>
              <p>
                <strong className="text-ink">Why bivariate only:</strong> with roughly 20 annual
                observations, adding multiple predictors simultaneously risks overfitting and
                multicollinearity. Bivariate regressions are less powerful but more honest about what
                the data can support. Minimum 3 paired observations required.
              </p>
            </MethodSection>

            {/* Growth rates */}
            <MethodSection id="growth-rates" title="Growth rates & CAGR">
              <p>
                <strong className="text-ink">Where applied:</strong> Macro Outlook, Sector Intelligence,
                Tourism Monitor, Investment Tracker — anywhere a YoY change or multi-year trend is shown.
              </p>
              <p>
                <strong className="text-ink">Year-over-year (YoY) growth rate:</strong> most series in
                the source data are already published as YoY growth rates by the original compilers
                (NESDC, BOT, World Bank). Where a raw level is available, the dashboard computes:
              </p>
              <FormulaBlock>
                <div>YoY growth = (value_t &minus; value_(t&minus;1)) / |value_(t&minus;1)| &times; 100%</div>
                <div className="text-ink-soft text-xs mt-1">Absolute value in denominator prevents a sign flip when the base period is negative.</div>
              </FormulaBlock>
              <p>
                <strong className="text-ink">Compound annual growth rate (CAGR):</strong> used where a
                single annualized rate summarizes growth across a multi-year span — for example,
                summarizing tourism arrivals recovery from 2020 to 2024.
              </p>
              <FormulaBlock>
                <div>CAGR = (end_value / start_value)^(1/n) &minus; 1</div>
                <div className="text-ink-soft text-xs mt-1">n = number of years between start and end.</div>
              </FormulaBlock>
              <p>
                <strong className="text-ink">Why not a simple average of annual rates:</strong> simple
                averaging treats a 50% collapse followed by a 50% recovery as break-even, but it
                isn&rsquo;t — a 50% fall requires a 100% gain to recover. CAGR avoids this by working
                from actual start and end levels.
              </p>
              <p>
                <strong className="text-ink">Limitation:</strong> CAGR hides volatility. A series that
                dropped 60% one year and surged 80% another could show the same CAGR as a series that
                grew smoothly at 5% per year. Always check the annual chart alongside the CAGR figure.
              </p>
            </MethodSection>

            {/* Risk scoring */}
            <MethodSection id="risk-scoring" title="Risk scoring">
              <p>
                <strong className="text-ink">Where applied:</strong> Command Center (overall economic
                risk indicator) and Household &amp; Debt (household financial stress score).
              </p>
              <p>
                <strong className="text-ink">Design philosophy:</strong> the risk score is deliberately a
                transparent additive heuristic, not a black-box model. Each driver contributes a bounded
                number of points based on simple, named rules that can be read in plain English. The goal
                is a structured screening tool that shows its reasoning — not a model claiming precision
                it doesn&rsquo;t have.
              </p>
              <FormulaBlock>
                <div>score = clamp( &Sigma; driver_contributions, 0, 100 )</div>
                <div className="mt-2 text-ink-soft text-xs">
                  0&ndash;24 &rarr; Low &nbsp;|&nbsp; 25&ndash;44 &rarr; Moderate &nbsp;|&nbsp; 45&ndash;69 &rarr; Elevated &nbsp;|&nbsp; 70&ndash;100 &rarr; High
                </div>
              </FormulaBlock>
              <p>Example drivers and their contribution rules (these vary by score type):</p>
              <GlassCard padded={false} className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-glass-border bg-surface-strong">
                      <th className="px-4 py-2.5 text-left font-label text-xs font-semibold text-ink-soft uppercase tracking-wide">Driver</th>
                      <th className="px-4 py-2.5 text-left font-label text-xs font-semibold text-ink-soft uppercase tracking-wide">Rule</th>
                      <th className="px-4 py-2.5 text-right font-label text-xs font-semibold text-ink-soft uppercase tracking-wide">Max pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-border">
                    {[
                      ['Household debt / GDP', 'Above 80%: +15 pts, above 90%: +25 pts', '25'],
                      ['NPL ratio', 'Above 3%: +10 pts, above 5%: +20 pts', '20'],
                      ['Real GDP growth', 'Below 2%: +10 pts, below 0%: +20 pts', '20'],
                      ['Policy rate trajectory', 'Rising >100bp in 12 months: +10 pts', '10'],
                      ['Current account balance', 'Deficit > 3% of GDP: +10 pts', '10'],
                      ['Inflation', 'Above 4% or below −1%: +10 pts', '10'],
                    ].map(([d, r, p]) => (
                      <tr key={d} className="hover:bg-surface-strong/50">
                        <td className="px-4 py-2.5 font-medium text-ink">{d}</td>
                        <td className="px-4 py-2.5 text-ink-muted">{r}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-ink">{p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
              <p>
                <strong className="text-ink">Limitation:</strong> the thresholds and weights are
                judgment calls grounded in macroprudential literature, not statistically fitted to a
                training set. The score is a structured way to read several indicators simultaneously —
                not a forecast of crisis probability. Two economies with identical scores can have very
                different outlooks depending on institutional quality, policy buffers, and factors not
                captured here.
              </p>
            </MethodSection>

            {/* Forecasting */}
            <MethodSection id="forecasting" title="Linear trend forecast">
              <p>
                <strong className="text-ink">Where applied:</strong> Forecast Lab — the baseline
                projections for GDP growth, inflation, and other key indicators.
              </p>
              <p>
                <strong className="text-ink">What it does:</strong> fits an OLS regression of observed
                values on a simple integer time index (1, 2, 3, …) over the most recent 10 data points,
                then extrapolates that linear trend forward.
              </p>
              <FormulaBlock>
                <div>For each historical point i in [0..lookback&minus;1]:</div>
                <div className="ml-4 mt-1">fit OLS: value ~ &alpha; + &beta; &middot; i</div>
                <div className="mt-2">For each forecast horizon h in [1..H]:</div>
                <div className="ml-4 mt-1">forecast_h = &alpha; + &beta; &middot; (lookback &minus; 1 + h)</div>
              </FormulaBlock>
              <p>
                <strong className="text-ink">Why this method:</strong> the dashboard values transparency
                over sophistication. A linear OLS trend is the simplest defensible extrapolation of
                recent history and can be fully reproduced in a spreadsheet using SLOPE and INTERCEPT
                functions. More complex time-series models (ARIMA, VAR, state-space) would add opacity
                without materially improving accuracy at a 1&ndash;3 year horizon with ~20 annual observations.
              </p>
              <p>
                <strong className="text-ink">Scenario modeling:</strong> the Forecast Lab lets you
                adjust growth, inflation, and external-demand assumptions to produce optimistic and
                pessimistic paths. These are arithmetic adjustments to the baseline (e.g., +0.5 pp
                for the optimistic scenario), not statistically derived confidence intervals — and the
                dashboard labels them explicitly as such.
              </p>
              <p>
                <strong className="text-ink">Critical limitation:</strong> a linear trend assumes the
                recent past continues at the same rate. It cannot model structural breaks — a pandemic,
                a policy reversal, an export shock — and will be wrong whenever the world changes faster
                than the trend. The 3&ndash;5 year projections should be read as &ldquo;where this trend goes
                if nothing unusual happens&rdquo; — a baseline, not a prediction.
              </p>
            </MethodSection>

            {/* Derived indicators */}
            <MethodSection id="derived-indicators" title="Derived indicators">
              <p>
                Several series shown on this dashboard are not directly published by any source — they
                are computed by this project from official series. Each is documented below.
              </p>

              <div className="flex flex-col gap-7">
                <div>
                  <p className="font-semibold text-ink mb-1">Tourism Recovery Index</p>
                  <p>
                    Measures how far tourism arrivals have recovered relative to the 2019
                    pre-pandemic peak, expressed as a percentage.
                  </p>
                  <FormulaBlock>
                    <div>Recovery Index = (arrivals_t / arrivals_2019) &times; 100</div>
                    <div className="text-ink-soft text-xs mt-1">100 = full recovery to 2019 level &nbsp;|&nbsp; 50 = half of 2019 arrivals</div>
                  </FormulaBlock>
                  <p>
                    <strong className="text-ink">Why 2019:</strong> 2019 was the last normal year before
                    COVID-19 disrupted international travel globally. Using it as the base makes the
                    recovery curve internationally comparable — most tourism bodies (UNWTO, WTTC) use
                    the same benchmark.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-ink mb-1">Trade openness ratio</p>
                  <p>Measures Thailand&rsquo;s integration into global trade as a share of the economy.</p>
                  <FormulaBlock>
                    <div>Trade openness = (exports + imports) / GDP &times; 100%</div>
                  </FormulaBlock>
                  <p>
                    A figure above 100% — which Thailand frequently posts — means total trade flows
                    exceed annual output. This reflects deep integration into manufactured goods supply
                    chains. This is standard World Bank methodology.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-ink mb-1">Household debt-to-GDP ratio</p>
                  <p>
                    Published directly by the Bank of Thailand and cross-checked against World Bank
                    data; not computed here from components.
                  </p>
                  <FormulaBlock>
                    <div>HH debt / GDP = total household debt outstanding / nominal GDP &times; 100%</div>
                  </FormulaBlock>
                  <p>
                    Thailand&rsquo;s ratio has exceeded 90% in recent years — among the highest in Southeast
                    Asia. The international benchmark for &ldquo;elevated&rdquo; household debt risk is
                    typically 80% of GDP, based on BIS and IMF macroprudential research.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-ink mb-1">FDI net inflows as % of GDP</p>
                  <p>
                    Foreign direct investment net inflows (inflows minus outflows) divided by nominal GDP.
                    Sourced from World Bank World Development Indicators and normalized to GDP for
                    cross-year comparability.
                  </p>
                  <FormulaBlock>
                    <div>FDI % GDP = net FDI inflows / nominal GDP &times; 100%</div>
                  </FormulaBlock>
                </div>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-glass-border bg-surface-strong px-4 py-3 text-sm text-ink-muted mt-2">
                <strong className="text-ink">Labeling convention:</strong> every derived indicator carries
                a <SourceBadge sourceName="Derived" reliability="secondary" compact /> badge in the
                dashboard. This distinguishes it from directly published figures and prompts users to
                check the formula before drawing conclusions.
              </div>
            </MethodSection>

          </div>
        </div>
      )}
    </div>
  );
}
