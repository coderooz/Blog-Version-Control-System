'use client';
import React from 'react';
import { Card, CardHeader, CardContent } from '@ui/card';

export default function DiffViewer({ html }: { html: string }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Diff</h3>
      </CardHeader>
      <CardContent>
        <div
          className="min-h-[200px] rounded-xl border border-slate-200 p-3 text-sm leading-6"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </CardContent>

      <style jsx>{`
        .vcs-ins { background-color: rgba(16,185,129,0.22); text-decoration: none; }
        .vcs-del { background-color: rgba(239,68,68,0.18); text-decoration: line-through; }
      `}</style>
    </Card>
  );
}
