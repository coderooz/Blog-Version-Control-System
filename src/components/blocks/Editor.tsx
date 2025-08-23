'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

import type { Editor } from '@tiptap/core';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@ui/card';

type Props = {
  initialHtml?: string;
  title?: string;
  onSave: (payload: { blogId?: string | null; title: string; content: string }) => Promise<void>;
  blogId?: string | null;
};

export default function EditorComponent({
  initialHtml = '',
  title = 'Untitled',
  onSave,
  blogId = null
}: Props) {
  const [localTitle, setLocalTitle] = useState(title);

  const editor: Editor | null = useEditor({
    extensions: [StarterKit],
    // extensions: [Document, Paragraph, Text],
    content: initialHtml,
    immediatelyRender: false
  });

  useEffect(() => {
    if (editor && initialHtml) {
      editor.commands.setContent(initialHtml);
    }
  }, [editor, initialHtml]);

  const handleSave = async () => {
    if (!editor) return;
    const html = editor.getHTML();
    await onSave({ blogId, title: localTitle || 'Untitled', content: html });
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Blog Editor</h2>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          value={localTitle}
          onChange={(e) => setLocalTitle(e.target.value)}
          placeholder="Post title"
        />
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</Button>
            <Button variant="outline" onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</Button>
            <Button variant="outline" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
            <Button variant="outline" onClick={() => editor?.chain().focus().toggleBulletList().run()}>UL</Button>
            <Button variant="outline" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>OL</Button>
            <Button variant="outline" onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>Code</Button>
            <Button variant="ghost" onClick={() => editor?.chain().focus().undo().run()}>Undo</Button>
            <Button variant="ghost" onClick={() => editor?.chain().focus().redo().run()}>Redo</Button>
          </div>

          <div className="min-h-[320px] rounded-xl border p-3 text-sm">
            <EditorContent editor={editor as any} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>Save Version</Button>
      </CardFooter>
    </Card>
  );
}
