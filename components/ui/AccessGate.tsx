'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Lock, LockOpen } from 'lucide-react';

const SESSION_KEY = 'thailand_outlook_editor_auth';
const CORRECT_PASSWORD = 'Wai@024821';

interface AccessGateProps {
  children: ReactNode;
}

export default function AccessGate({ children }: AccessGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // SSR-hydration guard: setMounted triggers the first real render on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true);
    }
  }, []);

  function handleLock() {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
    setInput('');
    setError('');
  }

  if (!mounted) return null;

  if (unlocked) {
    return (
      <div className="flex min-w-0 flex-col gap-6">
        {/* Lock session banner */}
        <div className="flex items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] px-4 py-2.5">
          <LockOpen className="h-4 w-4 shrink-0 text-[var(--success)]" />
          <p className="text-sm text-ink-muted">
            <span className="font-semibold text-ink">Editor unlocked</span> — changes are saved directly to the source CSV.
          </p>
          <button
            onClick={handleLock}
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--glass-border)] bg-white/60 px-3 py-1.5 text-xs font-semibold text-ink-muted transition-all hover:border-[var(--danger)]/40 hover:bg-[var(--danger-soft)] hover:text-danger"
          >
            <Lock className="h-3 w-3" />
            Lock session
          </button>
        </div>
        {children}
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password.');
      setInput('');
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="glass-card w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)]">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Owner access only</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Enter the editor password to continue.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button
            type="submit"
            className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
