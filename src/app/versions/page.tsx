'use client';

import React from 'react';
import VersionList from '@blocks/VersionList';
import DiffViewer from '@blocks/DiffViewer';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Card, CardContent } from '@ui/card';

export default function VersionsPage() {
  const [blogId, setBlogId] = React.useState<string>('');
  const [versions, setVersions] = React.useState<any[]>([]);
  const [selectedHtml, setSelectedHtml] = React.useState<string>('');

  const fetchVersions = React.useCallback(async (id: string) => {
    const res = await fetch(`/api/get-versions?blogId=${id}`);
    const json = await res.json();
    if (json.ok) setVersions(json.versions);
    else setVersions([]);
  }, []);

  const handleLoad = async () => {
    if (!blogId) return;
    await fetchVersions(blogId);
  };

  const handleView = async (id: string) => {
    const v = versions.find((x: any) => x._id === id);
    setSelectedHtml(v?.content ?? '');
  };

  const handleCompare = (id: string) => {
    window.location.href = `/compare?a=${id}`;
  };

  const handleRevert = async (id: string) => {
    if (!blogId) return alert('Set blogId first');
    const res = await fetch('/api/revert-version', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId, versionId: id })
    });
    const json = await res.json();
    if (json.ok) {
      alert('Reverted and new version created');
      await fetchVersions(blogId);
    } else {
      alert(json.error ?? 'Error reverting');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Version History</h1>

      <div className="flex gap-2">
        <Input value={blogId} onChange={(e) => setBlogId(e.target.value)} placeholder="Blog ID" />
        <Button onClick={handleLoad}>Load Versions</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <VersionList versions={versions} onView={handleView} onCompare={handleCompare} onRevert={handleRevert} />
        </div>
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardContent className="space-y-2 p-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="min-h-[300px] rounded-xl border p-3 text-sm" dangerouslySetInnerHTML={{ __html: selectedHtml }} />
            </CardContent>
          </Card>
          <DiffViewer html="" />
        </div>
      </div>
    </div>
  );
}
