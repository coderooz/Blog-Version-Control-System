'use client';
import React from 'react';
import { Button } from '@ui/button';
import { Card, CardHeader, CardContent } from '@ui/card';

type VersionItem = { _id: string; createdAt: string };

export default function VersionList({
  versions,
  onView,
  onCompare,
  onRevert
}: {
  versions: VersionItem[];
  onView: (id: string) => void;
  onCompare: (id: string) => void;
  onRevert: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Versions</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {versions.map((v) => (
            <div key={v._id} className="flex items-center justify-between rounded-xl border p-2">
              <div className="text-sm">{new Date(v.createdAt).toLocaleString()}</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onView(v._id)}>View</Button>
                <Button variant="outline" onClick={() => onCompare(v._id)}>Compare</Button>
                <Button variant="destructive" onClick={() => onRevert(v._id)}>Revert</Button>
              </div>
            </div>
          ))}
          {versions.length === 0 && (
            <div className="rounded-xl border border-dashed p-4 text-center text-sm text-slate-500">
              No versions loaded yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
