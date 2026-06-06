import GlassCard from '@/components/GlassCard';
import TimeSeriesChart from '@/components/TimeSeriesChart';
import ResearchNote from '@/components/ResearchNote';
import DemoDataBanner from '@/components/DemoDataBanner';
import SourceBadge from '@/components/SourceBadge';
import DataFreshnessBadge from '@/components/DataFreshnessBadge';
import { findSeries, latestPoint, formatValue } from '@/lib/data';
import { ols } from '@/lib/stats';
import type { IndicatorSeries } from '@/lib/types';

/**
 * Builds a synthetic "trend line" series from an OLS fit over a real
 * series' points -- same dates, fitted values -- so TimeSeriesChart can
 * draw it alongside the actual data for an honest "above/below trend"
 * comparison. Marked isDemo so the chart's "Modeled estimate" cue still shows --
 * an honest flag that this line is fitted/computed, not a raw observed value.
 */
function trendLineSeries(
  base: IndicatorSeries,
  label: string,
): { series: IndicatorSeries; fit: NonNullable<ReturnType<typeof ols>> } | null {
  const xs = base.points.map((_, i) => i);
  const ys = base.points.map((p) => p.value);
  const fit = ols(xs, ys);
  if (!fit) return null;
  return {
    fit,
    series: {
      ...base,
      indicatorCode: `${base.indicatorCode}__trend`,
      indicatorName: label,
      isDemo: true,
      points: base.points.map((p, i) => ({ date: p.date, value: fit.predict(i) })),
    },
  };
}

export default function MacroOutlookPage() {
  const gdpGrowth = findSeries('real_gdp_growth_pct');
  const consumption = findSeries('consumer_market_household_consumption_growth');
  const investment = findSeries('investment_capital_private_investment_growth');
  const exportsYoy = findSeries('exports_goods_yoy_pct');
  const inflation = findSeries('cpi_inflation_pct');
  const policyRate = findSeries('policy_rate_yearend_pct');

  const trend = gdpGrowth ? trendLineSeries(gdpGrowth, 'Linear trend (full sample)') : null;
  const latestGrowth = gdpGrowth ? latestPoint(gdpGrowth) : undefined;
  const latestIndex = gdpGrowth ? gdpGrowth.points.length - 1 : 0;
  const trendAtLatest = trend?.fit.predict(latestIndex);
  const gap =
    latestGrowth !== undefined && trendAtLatest !== undefined ? latestGrowth.value - trendAtLatest : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 pb-16">
      <header className="max-w-3xl">
        <p className="font-label text-xs font-semibold uppercase tracking-wide text-secondary">The engine room</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-ink md:text-[2.5rem]">
          What actually drives Thailand&rsquo;s growth?
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
          GDP growth is a single headline built from many moving parts &mdash; how much households
          spend, how much businesses invest, how much the world buys from Thailand, and how the
          central bank steers prices in between. This page lays those parts side by side.
        </p>
      </header>

      <DemoDataBanner />

      {/* ---------------------------------------------------------- */}
      {/* What drives GDP growth?                                     */}
      {/* ---------------------------------------------------------- */}
      <section className="flex flex-col gap-5">
        <header>
          <p className="font-label text-xs font-semibold uppercase tracking-wide text-secondary">Inside the headline number</p>
          <h2 className="font-display mt-1 text-2xl font-semibold text-ink md:text-[2rem]">
            What drives GDP growth?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
            Households spending and businesses investing are the two engines that run hottest, most
            of the time. Lining them up against headline growth shows how closely they move together
            &mdash; and where they diverge.
          </p>
        </header>
        <GlassCard
          title="The domestic engine: growth, spending, and investment"
          subtitle="Real GDP growth vs. household consumption growth vs. private investment growth, annual"
        >
          {gdpGrowth && consumption && investment ? (
            <TimeSeriesChart series={[gdpGrowth, consumption, investment]} variant="line" />
          ) : (
            <p className="text-sm text-ink-soft">Series unavailable.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {gdpGrowth && <SourceBadge sourceName={gdpGrowth.sourceName} sourceUrl={gdpGrowth.sourceUrl} reliability="secondary" compact />}
            {consumption && <SourceBadge sourceName={consumption.sourceName} sourceUrl={consumption.sourceUrl} reliability="secondary" compact />}
          </div>
        </GlassCard>
        <ResearchNote title="A possible reading">
          <p>
            When consumption and investment swing in the same direction as headline growth &mdash;
            and usually with more amplitude &mdash; that&rsquo;s consistent with the textbook story:
            domestic demand is doing most of the work, for better or worse. Sharp investment dips
            that headline growth doesn&rsquo;t fully share can be an early tell that businesses are
            more cautious than the aggregate number suggests.
          </p>
          <p>
            <strong className="text-ink">Worth being careful about:</strong> moving together is not
            the same as one causing the other. Evidence suggests these three are tightly linked in
            Thailand&rsquo;s economy, but the direction of cause-and-effect runs both ways &mdash;
            growth fuels confidence, and confidence fuels growth.
          </p>
        </ResearchNote>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* How do inflation, policy rate, exports & consumption interact? */}
      {/* ---------------------------------------------------------- */}
      <section className="flex flex-col gap-5">
        <header>
          <p className="font-label text-xs font-semibold uppercase tracking-wide text-secondary">The feedback loop</p>
          <h2 className="font-display mt-1 text-2xl font-semibold text-ink md:text-[2rem]">
            How do prices, policy, and demand interact?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
            The Bank of Thailand sets its policy rate partly in response to inflation &mdash; and that
            rate, in turn, shapes how freely households spend and the country trades with the world.
            Three views of that loop, side by side.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <GlassCard
            title="Prices and the policy response"
            subtitle="Headline CPI inflation vs. the Bank of Thailand's policy interest rate"
          >
            {inflation && policyRate ? (
              <TimeSeriesChart series={[inflation, policyRate]} variant="line" />
            ) : (
              <p className="text-sm text-ink-soft">Series unavailable.</p>
            )}
          </GlassCard>
          <GlassCard
            title="Demand at home and abroad"
            subtitle="Household consumption growth vs. goods-export growth, year over year"
          >
            {consumption && exportsYoy ? (
              <TimeSeriesChart series={[consumption, exportsYoy]} variant="line" />
            ) : (
              <p className="text-sm text-ink-soft">Series unavailable.</p>
            )}
          </GlassCard>
        </div>
        <ResearchNote title="A possible reading">
          <p>
            When inflation runs hot, a rate increase usually follows within the same year or the
            next &mdash; a possible causal pathway, not a guarantee, since the central bank also
            weighs growth, the currency, and global conditions. Higher rates then tend to cool
            household spending by making borrowing and saving trade-offs less attractive to spend
            freely.
          </p>
          <p>
            Export growth, meanwhile, often swings on factors well outside Thailand&rsquo;s
            borders &mdash; global demand cycles, shipping costs, currency moves &mdash; which is
            part of why it doesn&rsquo;t always track domestic consumption. A widening gap between
            the two lines is usually a sign that external, not internal, forces are setting the pace.
          </p>
        </ResearchNote>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Above or below trend?                                       */}
      {/* ---------------------------------------------------------- */}
      <section className="flex flex-col gap-5">
        <header>
          <p className="font-label text-xs font-semibold uppercase tracking-wide text-secondary">Putting today in context</p>
          <h2 className="font-display mt-1 text-2xl font-semibold text-ink md:text-[2rem]">
            Is current growth above or below its long-run trend?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
            A single year rarely tells you much on its own. Fitting a straight line through two
            decades of growth gives a simple, visible reference point &mdash; and shows exactly how
            that line was drawn.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_minmax(0,320px)]">
          <GlassCard
            title="Real GDP growth vs. its own long-run trend line"
            subtitle="A simple ordinary-least-squares fit through every year in the sample -- the straight line is the 'expected' path, not a forecast"
          >
            {gdpGrowth && trend ? (
              <TimeSeriesChart series={[gdpGrowth, trend.series]} variant="line" />
            ) : (
              <p className="text-sm text-ink-soft">Series unavailable.</p>
            )}
            {gdpGrowth && <DataFreshnessBadge series={gdpGrowth} />}
          </GlassCard>
          <GlassCard title="Show the work" subtitle="Exactly how the trend line was fitted">
            {trend && latestGrowth && trendAtLatest !== undefined && gap !== null ? (
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-muted">
                <p>
                  <span className="font-label font-semibold text-ink">Fitted line: </span>
                  growth ≈ {trend.fit.intercept.toFixed(2)} + {trend.fit.slope.toFixed(3)} ×
                  (year index)
                </p>
                <p>
                  <span className="font-label font-semibold text-ink">Fit quality (R²): </span>
                  {trend.fit.rSquared.toFixed(2)} &mdash; {trend.fit.rSquared < 0.15
                    ? 'low, meaning year-to-year swings dominate over any steady drift'
                    : trend.fit.rSquared < 0.4
                      ? 'modest, meaning the trend explains only part of the year-to-year movement'
                      : 'fairly strong for a macro growth series'}
                  .
                </p>
                <p>
                  <span className="font-label font-semibold text-ink">Latest reading: </span>
                  {formatValue(latestGrowth.value, gdpGrowth?.unit ?? '')} vs. a trend-line expectation of{' '}
                  {formatValue(trendAtLatest, gdpGrowth?.unit ?? '')} for the same year &mdash; that&rsquo;s{' '}
                  <strong className={gap >= 0 ? 'text-success' : 'text-danger'}>
                    {Math.abs(gap).toFixed(1)} percentage points {gap >= 0 ? 'above' : 'below'}
                  </strong>{' '}
                  the line.
                </p>
                <p className="text-xs text-ink-soft">
                  <strong className="text-ink-muted">Assumptions &amp; limitations:</strong> a straight
                  line is the simplest possible trend model -- it cannot capture cycles, structural
                  breaks (like the 2020 shock visible in the chart), or policy changes. Treat the gap
                  above as a rough compass heading, not a verdict on whether the economy is &ldquo;doing
                  well.&rdquo;
                </p>
              </div>
            ) : (
              <p className="text-sm text-ink-soft">Not enough data to fit a trend line.</p>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
