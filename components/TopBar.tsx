'use client';

import { usePathname } from 'next/navigation';
import { Menu, Sparkles } from 'lucide-react';
import { NAV_ITEMS, DOCS_ITEM } from '@/lib/nav';
import { openMobileNav } from './Sidebar';

function currentNavItem(pathname: string) {
  return (
    NAV_ITEMS.find((item) => item.href === pathname) ||
    (pathname === DOCS_ITEM.href ? DOCS_ITEM : undefined)
  );
}

export default function TopBar() {
  const pathname = usePathname();
  const current = currentNavItem(pathname);

  return (
    <header className="glass sticky top-0 z-30 flex items-center gap-3 border-b border-glass-border px-4 py-3 md:px-8">
      <button
        onClick={openMobileNav}
        aria-label="Open navigation"
        className="rounded-[var(--radius-sm)] p-2 text-ink-muted hover:bg-surface-strong hover:text-ink md:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink md:text-base">
          {current?.label ?? 'Thailand Outlook'}
        </p>
        {current?.description && (
          <p className="hidden truncate text-xs text-ink-soft sm:block">{current.description}</p>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="glass-card hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-secondary sm:flex">
          <Sparkles size={14} strokeWidth={2} />
          Research preview · compiled dataset
        </span>
      </div>
    </header>
  );
}
