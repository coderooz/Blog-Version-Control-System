'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';

import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Gapcursor } from '@tiptap/extensions'
import { FontSize, LineHeight, TextStyle, Color, FontFamily, BackgroundColor } from '@tiptap/extension-text-style';


import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@ui/card';
import MenuBar from '@blocks/MenuBar';

type Props = {
  initialHtml?: string;
  title?: string;
  onSave: (payload: { blogId?: string | null; title: string; content: string }) => Promise<void>;
  blogId?: string | null;
};

const basicHtml = `
  <h1>Hello World</h1>
  <p>Write your content here.</p>
`;

export default function EditorComponent({initialHtml = '', title = 'Untitled', onSave, blogId = null}: Props) {
  const [localTitle, setLocalTitle] = useState(title);

  const editor: Editor | null = useEditor({
    editable: true,
    extensions: [
      Document, 
      Text, 
      TextStyle, 
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LineHeight.configure({
        types: ['paragraph', 'heading'],
        defaultLineHeight: '1.5',
        lineHeights: ['1', '1.15', '1.5', '1.75', '2', '2.5', '3'],
      }),
      Paragraph, 
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'table-auto border-collapse border border-gray-300',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Color,
      BackgroundColor,
      FontFamily, 
      FontSize.configure({
        types: ['textStyle'],
      }),
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'text-base leading-relaxed text-gray-800 dark:text-gray-200',
          },
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: 'font-bold text-gray-900 dark:text-gray-200 mb-2 select-none',
          },
        },
      }),
      Underline,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes : {
          class : "text-yellow-400",
        }
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')
            if (disallowedProtocols.includes(protocol)) {
              return false
            }
            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }
            const disallowedDomains = []
            const domain = parsedUrl.hostname
            if (disallowedDomains.includes(domain)) {
              return false
            }
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)
            const disallowedDomains = []
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },
      }),
      Image,
      Youtube.configure({
        width: 640,
        height: 360,
      }),
      HorizontalRule
    ],
    content: initialHtml || basicHtml,
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert focus:outline-none min-h-10',
      },
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
    await onSave({
      blogId,
      title: localTitle || 'Untitled',
      content: html,
    });
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
          <MenuBar editor={editor} />
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
