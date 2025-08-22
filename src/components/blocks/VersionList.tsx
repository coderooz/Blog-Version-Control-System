// @blocks/VersionList.tsx
'use client';

import React from 'react';

type VersionItem = {
  _id: string;
  createdAt: string;
};

type Props = {
  versions: VersionItem[];
  onView: (id: string) => void;
  onCompare: (id: string) => void;
  onRevert: (id: string) => void;
};

export default function VersionList({ versions, onView, onCompare, onRevert }: Props) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Versions</h3>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="text-left">Timestamp</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {versions.map((v) => (
            <tr key={v._id} className="border-t">
              <td className="py-2">{new Date(v.createdAt).toLocaleString()}</td>
              <td className="py-2 flex gap-2">
                <button onClick={() => onView(v._id)} className="px-2 py-1 border rounded">View</button>
                <button onClick={() => onCompare(v._id)} className="px-2 py-1 border rounded">Compare</button>
                <button onClick={() => onRevert(v._id)} className="px-2 py-1 border rounded text-red-600">Revert</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}