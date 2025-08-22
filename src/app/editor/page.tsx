// app/editor/page.tsx

"use client"
import React from 'react';
import EditorComponent from '@blocks/Editor';
import type { Metadata } from 'next';

export const metadata:Metadata = { title: 'Editor' };

export default async function EditorPage() {
  // Server component can fetch initial blog if needed. For simplicity we render client Editor and interact with APIs.
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blog Editor</h1>
      {/* Editor is client-component - import below will use 'use client' */}
      <EditorWrapper />
    </div>
  );
}

function EditorWrapper() {
  'use client';
  const [blogId, setBlogId] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  const handleSave = async ({ blogId: bId, title, content }: { blogId?: string | null; title: string; content: string }) => {
    const res = await fetch('/api/save-version', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId: bId, title, content }),
    });
    const json = await res.json();
    if (json.ok) {
      setBlogId(json.blog._id);
      setNotification('Saved version ✔');
      setTimeout(() => setNotification(null), 2000);
    } else {
      setNotification('Error saving');
    }
  };

  return (
    <div>
      {notification && <div className="mb-2 text-sm text-green-600">{notification}</div>}
      <EditorComponent initialHtml={''} title={''} onSave={handleSave} blogId={blogId} />
    </div>
  );
}