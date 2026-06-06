import { ExternalLink, Mail } from 'lucide-react';

export const metadata = {
  title: 'Contact — Thailand Outlook',
  description: 'Who built Thailand Outlook, and why.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 pb-20">
      <header>
        <p className="font-label text-xs font-semibold uppercase tracking-wide text-secondary">Behind the dashboard</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-ink md:text-[2.5rem]">
          Contact
        </h1>
      </header>

      {/* Personal statement */}
      <section className="glass-card flex flex-col gap-5 p-8">
        <div className="flex flex-col gap-4 text-base leading-relaxed text-ink-muted">
          <p>
            I built Thailand Outlook because I kept running into the same problem: Thailand&rsquo;s
            economic data is scattered across a dozen institutions, buried in PDFs, with no visual
            layer and no clear source trail. The Bank of Thailand publishes one thing, NESDC
            publishes another, the Tourism Authority publishes a third &mdash; and reconciling them
            into a coherent picture was a manual exercise every single time.
          </p>
          <p>
            I&rsquo;m <span className="font-semibold text-ink">Wai</span> &mdash; an analyst focused
            on Southeast Asian economies. Thailand sits at an interesting inflection point: recovering
            tourism, rising household debt, shifting FDI flows, and a monetary policy environment
            that&rsquo;s trickier than the headline numbers suggest. This dashboard is the platform
            I wished existed when I started paying attention to it.
          </p>
          <p>
            Every chart here traces directly to a named source, every series has a methodology note,
            and nothing is dressed up as more certain than it is. If you find a number that looks
            wrong, or a source that&rsquo;s gone stale, I want to know.
          </p>
        </div>
      </section>

      {/* Links */}
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-ink">Get in touch</h2>
        <div className="flex flex-col gap-3">
          <a
            href="mailto:harryethan136@gmail.com"
            className="glass-card group flex items-center gap-4 p-5 transition-all hover:border-[var(--primary)]/40"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)]">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink group-hover:text-primary transition-colors">Email</span>
              <span className="text-sm text-ink-muted">harryethan136@gmail.com</span>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100" />
          </a>

          <a
            href="https://www.bot.or.th/en/home.html"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card group flex items-center gap-4 p-5 transition-all hover:border-[var(--primary)]/40"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary-soft)]">
              <ExternalLink className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink group-hover:text-primary transition-colors">Bank of Thailand</span>
              <span className="text-sm text-ink-muted">Primary macro data source &mdash; bot.or.th</span>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100" />
          </a>

          <a
            href="https://www.nesdc.go.th/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card group flex items-center gap-4 p-5 transition-all hover:border-[var(--primary)]/40"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--secondary-soft)]">
              <ExternalLink className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink group-hover:text-primary transition-colors">NESDC</span>
              <span className="text-sm text-ink-muted">National Economic and Social Development Council &mdash; nesdc.go.th</span>
            </div>
            <ExternalLink className="ml-auto h-4 w-4 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </div>
      </section>

      {/* Honesty note */}
      <section className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface-strong)] px-6 py-5">
        <p className="text-sm leading-relaxed text-ink-muted">
          <span className="font-semibold text-ink">A note on data integrity:</span> every indicator
          in this dashboard is sourced from a public institution and cited on the{' '}
          <a href="/data-sources" className="text-primary underline-offset-2 hover:underline">
            Data Sources
          </a>{' '}
          page. No figures are estimated, interpolated, or adjusted without a clear label saying so.
          If a series has a gap, the chart shows the gap rather than filling it.
        </p>
      </section>
    </div>
  );
}
