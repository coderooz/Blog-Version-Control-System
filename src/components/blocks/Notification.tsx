// components/blocks/Notification.tsx
'use client';

import React from 'react';

export default function Notification({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}
