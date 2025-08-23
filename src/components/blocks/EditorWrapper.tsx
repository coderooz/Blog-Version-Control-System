'use client';
import React from 'react';
import EditorComponent from '@blocks/Editor';
import { Card } from '@ui/card';

export default function EditorWrapper() {
  const [blogId, setBlogId] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  const handleSave = async ({
    blogId: bId,
    title,
    content
  }: {
    blogId?: string | null;
    title: string;
    content: string;
  }) => {
    try {
      const res = await fetch('/api/save-version', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: bId, title, content })
      });
      const json = await res.json();
      if (json.ok) {
        setBlogId(json.blog._id);
        setNotification('Saved version ✔');
        setTimeout(() => setNotification(null), 2000);
      } else {
        setNotification(`Error saving: ${json.error ?? 'unknown'}`);
      }
    } catch {
      setNotification('Error saving');
    }
  };

  return (
    <div className="space-y-3">
      {notification && (
        <Card className="border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {notification}
        </Card>
      )}
      <EditorComponent initialHtml="" title="" onSave={handleSave} blogId={blogId} />
      {blogId && (
        <div className="text-sm text-slate-500">
          Current Blog ID: <span className="font-mono">{blogId}</span>
        </div>
      )}
    </div>
  );
}
