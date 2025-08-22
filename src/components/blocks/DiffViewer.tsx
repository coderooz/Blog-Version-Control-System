// @blocks/DiffViewer.tsx
'use client';

import React from 'react';

type Props = {
  html: string; // HTML with <ins> and <del> tags
};

export default function DiffViewer({ html }: Props) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Diff</h3>
      <div className="prose max-w-full">
        <div
          className="diff-container p-2 border rounded"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      <style jsx>{`
        .vcs-insert { background-color: rgba(16,185,129,0.2); text-decoration: none; }
        .vcs-delete { background-color: rgba(239,68,68,0.15); text-decoration: line-through; }
      `}</style>
    </div>
  );
}