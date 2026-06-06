import AccessGate from '@/components/ui/AccessGate';
import UserDataEditor from '@/components/data/UserDataEditor';

export const dynamic = 'force-dynamic';

export default function DataEditorPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-8 pb-16">
      <header className="max-w-3xl">
        <p className="font-label text-xs font-semibold uppercase tracking-wide text-secondary">Owner access</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-ink md:text-[2.5rem]">
          Data Editor
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
          Edit any value in the compiled datasets and save it directly to the source CSV &mdash;
          no code changes or redeployment needed. The dashboard re-reads from the updated file
          the next time a page loads.
        </p>
      </header>

      <AccessGate>
        <UserDataEditor />
      </AccessGate>
    </div>
  );
}
