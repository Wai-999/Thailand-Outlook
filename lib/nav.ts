import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  TrendingUp,
  Factory,
  Map,
  Network,
  Plane,
  Wallet,
  LineChart,
  Calculator,
  Telescope,
  BookOpen,
  Database,
  FileText,
  PencilRuler,
  UserRound,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Phase-1 (Frontend MVP) build priority -- see CLAUDE_EFFICIENT.md */
  implemented: boolean;
  description: string;
};

// Order mirrors the spec's "Main Navigation" list. The Phase-1 (Frontend
// MVP) six from "Build Priority" -- Command Center, Macro Outlook, Sector
// Intelligence, Statistical Engine, Forecast Lab, Data Sources -- shipped
// first. Tourism Monitor, Household & Debt, and Investment Tracker were
// added next because the compiled dataset has solid, traceable series for
// each (tourism arrivals/receipts/recovery, household & public/external
// debt, FDI/BOI investment/capital formation). Province Map, Trade
// Network, and Research Library remain clean placeholders: the dataset
// has no provincial/geographic breakdowns or bilateral trade-partner
// series, and Research Library would need real written research this
// dashboard doesn't have -- building those out now would mean dressing up
// invented figures as real ones, the opposite of this project's honesty rule.
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Command Center',
    href: '/',
    icon: LayoutDashboard,
    implemented: true,
    description: 'Where the story of the Thai economy starts each morning.',
  },
  {
    label: 'Macro Outlook',
    href: '/macro-outlook',
    icon: TrendingUp,
    implemented: true,
    description: 'GDP, inflation, trade, and the macro forces shaping growth.',
  },
  {
    label: 'Sector Intelligence',
    href: '/sector-intelligence',
    icon: Factory,
    implemented: true,
    description: 'How individual industries are really performing, sector by sector.',
  },
  {
    label: 'Province Map',
    href: '/province-map',
    icon: Map,
    implemented: false,
    description: 'A geographic lens on growth, investment, and disparity across provinces.',
  },
  {
    label: 'Trade Network',
    href: '/trade-network',
    icon: Network,
    implemented: false,
    description: 'Who Thailand trades with, and how those ties are shifting.',
  },
  {
    label: 'Tourism Monitor',
    href: '/tourism-monitor',
    icon: Plane,
    implemented: true,
    description: 'Arrivals, spending, and the recovery of a vital growth engine.',
  },
  {
    label: 'Household & Debt',
    href: '/household-debt',
    icon: Wallet,
    implemented: true,
    description: 'How Thai households are saving, borrowing, and coping.',
  },
  {
    label: 'Investment Tracker',
    href: '/investment-tracker',
    icon: LineChart,
    implemented: true,
    description: 'Capital flows, FDI, and where confidence is (and isn’t) building.',
  },
  {
    label: 'Statistical Engine',
    href: '/statistical-engine',
    icon: Calculator,
    implemented: true,
    description: 'Correlation, regression, and risk scoring -- with the math shown.',
  },
  {
    label: 'Forecast Lab',
    href: '/forecast-lab',
    icon: Telescope,
    implemented: true,
    description: 'Transparent, scenario-based projections -- assumptions included.',
  },
  {
    label: 'Research Library',
    href: '/research-library',
    icon: BookOpen,
    implemented: false,
    description: 'Notes, methodology write-ups, and further reading.',
  },
  {
    label: 'Data Sources',
    href: '/data-sources',
    icon: Database,
    implemented: true,
    description: 'Where every number comes from, and how fresh it is.',
  },
  {
    label: 'Data Editor',
    href: '/data-editor',
    icon: PencilRuler,
    implemented: true,
    description: 'Edit indicator values directly — no code changes needed.',
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: UserRound,
    implemented: true,
    description: 'Who built this, and why.',
  },
];

export const DOCS_ITEM: NavItem = {
  label: 'Documentation',
  href: '/docs',
  icon: FileText,
  implemented: true,
  description: 'How this dashboard works, and how to read it responsibly.',
};
