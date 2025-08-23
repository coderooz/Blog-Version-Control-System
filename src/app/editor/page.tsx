import EditorWrapper from '@blocks/EditorWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Editor' };

export default function EditorPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Blog Editor</h1>
      <EditorWrapper />
    </div>
  );
}
