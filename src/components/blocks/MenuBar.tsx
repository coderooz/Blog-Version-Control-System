'use client';

import {
  Bold, Italic, Underline, Strikethrough, Highlighter,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  List, ListOrdered, Quote, Code, Image, Video, Undo2, Redo2,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link, Unlink,
  Minus, PaintBucket, ALargeSmall 
} from "lucide-react";
import { Editor } from '@tiptap/core';
import { ToggleGroup } from "@ui/toggle-group";
import { Toggle } from "@ui/toggle";
import { useEffect, useState } from "react";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  const [, setRefresh] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const update = () => setRefresh(prev => prev + 1);
    editor.on('selectionUpdate', update);
    editor.on('transaction', update);

    return () => {
      editor.off('selectionUpdate', update);
      editor.off('transaction', update);
    };
  }, [editor]);

  if (!editor) return null;

  const currentTextColor = editor.getAttributes('textStyle')?.color || '#000000';
  const currentBgColor = editor.getAttributes('textStyle')?.backgroundColor || '#ffffff';

  return (
    <div className="flex flex-wrap gap-3 border rounded-lg p-3 items-center">
      {/* Undo / Redo */}
      <ToggleGroup type="single" className="flex gap-1 rounded" variant="outline">
        <Toggle pressed={false} onPressedChange={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={false} onPressedChange={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>

      <div className="flex gap-3 items-center">
        {/* Font Size */}
        <label className="flex items-center gap-1">
          <select
            value={editor.getAttributes('textStyle')?.fontSize || '16px'}
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            className="border rounded px-2 py-1 text-sm"
            title="Font Size"
          >
            {['12px', '14px', '16px', '18px', '24px', '32px', '48px'].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
 
        {/* Font Family */}
        <label className="flex items-center gap-1">
          <select
            value={editor.getAttributes('textStyle')?.fontFamily || 'sans-serif'}
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            className="border rounded px-2 py-1 text-sm"
            title="Font Family"
          >
            <option value="sans-serif">Sans</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
          </select>
        </label>

      </div>


      {/* Text Color */}
      <label className="flex items-center gap-1">
        <ALargeSmall className="h-4 w-4 text-red-500"/>
        <input
          type="color"
          value={currentTextColor}
          onInput={event => editor.chain().focus().setColor(event.currentTarget.value).run()}
          className="w-6 h-6 border cursor-pointer rounded"
          title="Text Color"
        />
      </label>

      {/* Background Color */}
      <label className="flex items-center gap-1">
        <PaintBucket className="h-4 w-4 text-yellow-400" />
        <input
          type="color"
          value={currentBgColor}
          onInput={event => editor.chain().focus().setBackgroundColor(event.currentTarget.value).run()}
          className="w-6 h-6 border cursor-pointer rounded"
          title="Background Color"
        />
      </label>

      {/* Text Styles */}
      <ToggleGroup type="multiple" className="flex gap-1">
        <Toggle pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()}>
          <Underline className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive('highlight')} onPressedChange={() => editor.chain().focus().toggleHighlight().run()}>
          <Highlighter className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>

      {/* Headings */}
      <ToggleGroup type="single" className="flex gap-1">
        {[1, 2, 3, 4, 5, 6].map((level) => {
          const Icon = {
            1: Heading1, 2: Heading2, 3: Heading3,
            4: Heading4, 5: Heading5, 6: Heading6,
          }[level];
          return (
            <Toggle
              key={level}
              pressed={editor.isActive('heading', { level })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level }).run()}
            >
              <Icon className="h-4 w-4" />
            </Toggle>
          );
        })}
      </ToggleGroup>

      {/* Alignment */}
      <ToggleGroup type="single" className="flex gap-1" variant="outline">
        <Toggle pressed={editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive({ textAlign: 'justify' })} onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}>
          <AlignJustify className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>

      <label className="flex items-center gap-1">
        <select
          value={editor.getAttributes('lineHeight')?.lineHeight || '1.5'}
          onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
          className="border rounded px-2 py-1 text-sm"
          title="Line Height"
        >
          {['1', '1.15', '1.5', '1.75', '2', '2.5', '3'].map(height => (
            <option key={height} value={height}>
              {height}
            </option>
          ))}
        </select>
      </label>

      {/* Lists & Quotes */}
      <ToggleGroup type="multiple" className="flex gap-1">
        <Toggle pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={editor.isActive('codeBlock')} onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code className="h-4 w-4" />
        </Toggle>
        <Toggle pressed={false} onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>

      {/* Table Controls */}
      <ToggleGroup type="multiple" className="flex gap-1">
        <Toggle onPressedChange={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
          <span className="text-xs">Table</span>
        </Toggle>
        <Toggle onPressedChange={() => editor.chain().focus().addColumnBefore().run()}>
          <span className="text-xs">+Col</span>
        </Toggle>
        <Toggle onPressedChange={() => editor.chain().focus().addColumnAfter().run()}>
          <span className="text-xs">Col+</span>
        </Toggle>
        <Toggle onPressedChange={() => editor.chain().focus().addRowBefore().run()}>
          <span className="text-xs">+Row</span>
        </Toggle>
        <Toggle onPressedChange={() => editor.chain().focus().addRowAfter().run()}>
          <span className="text-xs">Row+</span>
        </Toggle>
        <Toggle onPressedChange={() => editor.chain().focus().deleteColumn().run()}>
          <span className="text-xs">DelCol</span>
        </Toggle>
        <Toggle onPressedChange={() => editor.chain().focus().deleteRow().run()}>
          <span className="text-xs">DelRow</span>
        </Toggle>
        <Toggle onPressedChange={() => editor.chain().focus().deleteTable().run()}>
          <span className="text-xs">DelTbl</span>
        </Toggle>
      </ToggleGroup>


      {/* Links */}
      <ToggleGroup type="multiple" className="flex gap-1">
        <Toggle pressed={editor.isActive('link')} onPressedChange={() => {
          const prevUrl = editor.getAttributes('link')?.href;
          const url = window.prompt("Enter URL", prevUrl || "");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().unsetLink().run();
          } else {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}>
          <Link className="h-4 w-4 text-blue-600" />
        </Toggle>
        <Toggle pressed={false} onPressedChange={() => editor.chain().focus().unsetLink().run()}>
          <Unlink className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>

      {/* Media */}
      <ToggleGroup type="multiple" className="flex gap-1">
        <Toggle pressed={false} onPressedChange={() => {
          const url = window.prompt("Enter image URL");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}>
          <Image className="h-4 w-4" />
        </Toggle>

        <Toggle pressed={false} onPressedChange={() => {
          const url = window.prompt("Enter YouTube/Vimeo embed URL");
          if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run();
          }
        }}>
          <Video className="h-4 w-4" />
        </Toggle>
      </ToggleGroup>
    </div>
  );
}
