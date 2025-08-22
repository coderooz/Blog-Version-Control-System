// @blocks/Editor.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { Editor } from '@tiptap/core';
import classNames from 'classnames';

type Props = {
  initialHtml?: string;
  title?: string;
  onSave: (payload: { blogId?: string | null; title: string; content: string }) => Promise<void>;
  blogId?: string | null;
};

export default function EditorComponent({ initialHtml = '', title = 'Untitled', onSave, blogId = null }: Props) {
  const [localTitle, setLocalTitle] = useState(title);
  const editor: Editor | null = useEditor({
    extensions: [StarterKit],
    content: initialHtml,
    onUpdate: ({ editor }) => {
      // auto-update local state if you want; TipTap keeps internal state
    },
  });

  useEffect(() => {
    if (editor && initialHtml) {
      editor.commands.setContent(initialHtml);
    }
  }, [editor, initialHtml]);

  const handleSave = async () => {
    if (!editor) return;
    const html = editor.getHTML();
    await onSave({ blogId, title: localTitle, content: html });
  };

  return (
    <div className="p-4 bg-white rounded-md shadow">
      <input
        value={localTitle}
        onChange={(e) => setLocalTitle(e.target.value)}
        placeholder="Post title"
        className="w-full mb-3 p-2 border rounded"
      />

      <div className="prose max-w-full mb-3">
        <div className="toolbar mb-2 flex gap-2">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">Bold</button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">Italic</button>
          <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded">Underline</button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">UL</button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">OL</button>
          <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()} className="px-2 py-1 border rounded">Code</button>
        </div>
        <div className="editor border rounded p-3 min-h-[300px]">
          <EditorContent editor={editor as any} />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button onClick={handleSave} className="px-4 py-2 bg-sky-600 text-white rounded">Save Version</button>
      </div>
    </div>
  );
}