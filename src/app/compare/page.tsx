// app/compare/page.tsx
'use client';
import React from 'react';
import DiffViewer from '@blocks/DiffViewer';

export default function ComparePage() {
  const [a, setA] = React.useState<string | null>(null);
  const [b, setB] = React.useState<string | null>(null);
  const [diffHtml, setDiffHtml] = React.useState<string>('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aa = params.get('a');
    const bb = params.get('b');
    if (aa) setA(aa);
    if (bb) setB(bb);
  }, []);

  const runCompare = async () => {
    if (!a || !b) return alert('please set both version ids');
    const res = await fetch(`/api/compare-versions?a=${a}&b=${b}`);
    const json = await res.json();
    if (json.ok) setDiffHtml(json.diffHtml);
    else alert('error');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Compare Versions</h1>

      <div className="mb-4 flex gap-2">
        <input placeholder="Version A id" value={a ?? ''} onChange={(e) => setA(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Version B id" value={b ?? ''} onChange={(e) => setB(e.target.value)} className="p-2 border rounded" />
        <button onClick={runCompare} className="px-3 py-2 bg-sky-600 text-white rounded">Compare</button>
      </div>

      <DiffViewer html={diffHtml} />
    </div>
  );
}