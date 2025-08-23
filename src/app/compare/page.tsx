'use client';

import React from 'react';
import DiffViewer from '@blocks/DiffViewer';
import { Button } from '@ui/button';
import { Input } from '@/ui/input';

export default function ComparePage() {
  const [a, setA] = React.useState<string>('');
  const [b, setB] = React.useState<string>('');
  const [diffHtml, setDiffHtml] = React.useState<string>('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aa = params.get('a');
    const bb = params.get('b');
    if (aa) setA(aa);
    if (bb) setB(bb);
  }, []);

  const runCompare = async () => {
    if (!a || !b) return alert('Please set both version ids');
    const res = await fetch(`/api/compare-versions?a=${a}&b=${b}`);
    const json = await res.json();
    if (json.ok) setDiffHtml(json.diffHtml);
    else alert(json.error ?? 'error');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Compare Versions</h1>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Version A id" value={a} onChange={(e) => setA(e.target.value)} />
        <Input placeholder="Version B id" value={b} onChange={(e) => setB(e.target.value)} />
        <Button onClick={runCompare}>Compare</Button>
      </div>

      <DiffViewer html={diffHtml} />
    </div>
  );
}
