'use client';

import { useUIStore } from '@/lib/store';

/**
 * Wraps the main content area (TopBar + page content).
 * Collapses the sidebar to icon-only mode whenever the user
 * clicks or taps anywhere on the dashboard outside the sidebar.
 */
export default function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div
      className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden"
      onClick={() => {
        if (sidebarOpen) setSidebarOpen(false);
      }}
    >
      {children}
    </div>
  );
}
