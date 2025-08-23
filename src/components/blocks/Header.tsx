import Link from 'next/link';

export default function HeaderSection() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold">Blog VCS</Link>
          <nav className="flex gap-2 text-sm text-slate-600">
            <Link href="/editor" className="rounded-xl px-2 py-1 hover:bg-slate-100">Editor</Link>
            <Link href="/versions" className="rounded-xl px-2 py-1 hover:bg-slate-100">Versions</Link>
            <Link href="/compare" className="rounded-xl px-2 py-1 hover:bg-slate-100">Compare</Link>
          </nav>
        </div>
        <div className="text-sm text-slate-500">V1 — Blog Version Control</div>
      </div>
    </header>
  );
}
