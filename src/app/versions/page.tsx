// app/versions/page.tsx
import React from 'react';
import VersionList from '@blocks/VersionList';
import DiffViewer from '@blocks/DiffViewer';

export const metadata = { title: 'Versions' };

export default function VersionsPage() {
  'use client';
  const [blogId, setBlogId] = React.useState<string | null>(null);
  const [versions, setVersions] = React.useState<any[]>([]);
  const [selectedHtml, setSelectedHtml] = React.useState<string>('');

  const fetchVersions = async (id: string) => {
    const res = await fetch(`/api/get-versions?blogId=${id}`);
    const json = await res.json();
    if (json.ok) setVersions(json.versions);
  };

  const handleLoad = async () => {
    if (!blogId) return;
    await fetchVersions(blogId);
  };

  const handleView = async (id: string) => {
    const res = await fetch(`/api/get-versions?blogId=${blogId}`);
    const json = await res.json();
    const v = json.versions.find((x: any) => x._id === id);
    setSelectedHtml(v.content);
  };

  const handleCompare = (id: string) => {
    // set selection for compare route
    // simple approach: open compare page with query params
    window.location.href = `/compare?a=${id}` + (blogId ? `&blogId=${blogId}` : '');
  };

  const handleRevert = async (id: string) => {
    if (!blogId) return alert('Set blogId first');
    const res = await fetch('/api/revert-version', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId, versionId: id }),
    });
    const json = await res.json();
    if (json.ok) {
      alert('Reverted and new version created');
      await fetchVersions(blogId);
    } else {
      alert('Error reverting');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Version History</h1>

      <div className="mb-4">
        <input value={blogId ?? ''} onChange={(e) => setBlogId(e.target.value)} placeholder="Blog ID" className="p-2 border rounded mr-2" />
        <button onClick={handleLoad} className="px-3 py-2 bg-sky-600 text-white rounded">Load Versions</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <VersionList versions={versions} onView={handleView} onCompare={handleCompare} onRevert={handleRevert} />
        </div>
        <div className="col-span-2">
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <div className="border p-3 rounded min-h-[300px]" dangerouslySetInnerHTML={{ __html: selectedHtml }} />
          </div>

          <div className="mt-4">
            <DiffViewer html={''} />
          </div>
        </div>
      </div>
    </div>
  );
}