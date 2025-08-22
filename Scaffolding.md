# Blog Version Control System — Full Project Code

This text document contains the full project code for **Blog Version Control System** using **Next.js 15 (App Router) + TypeScript + MongoDB + Mongoose + TipTap**.

> Save each file to your local project under the paths shown.

---

## File tree

```
blog-vcs/
├── app/
│   ├── api/
│   │   ├── save-version/route.ts
│   │   ├── get-versions/route.ts
│   │   ├── compare-versions/route.ts
│   │   └── revert-version/route.ts
│   ├── editor/page.tsx
│   ├── versions/page.tsx
│   └── compare/page.tsx
├── components/
│   ├── Editor.tsx
│   ├── VersionList.tsx
│   └── DiffViewer.tsx
├── lib/
│   ├── db.ts
│   └── versionControl.ts
├── models/
│   ├── BlogPost.ts
│   └── Version.ts
├── styles/
│   └── globals.css
├── .env.local (example)
├── next.config.js
├── tailwind.config.ts
├── postcss.config.cjs
├── package.json
└── README.md
```

---

> **Note:** Do **NOT** copy/paste the `.env.local` contents to any public place. Keep MongoDB URI secret.

---

## `package.json`

```json
{
  "name": "blog-vcs",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@tiptap/core": "^2.0.0",
    "@tiptap/react": "^2.0.0",
    "@tiptap/starter-kit": "^2.0.0",
    "classnames": "^2.3.2",
    "diff-match-patch": "^1.0.5",
    "diff2html": "^3.4.12",
    "mongoose": "^7.0.0",
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "shadcn-ui": "^0.1.0",
    "zustand": "^4.3.8"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "autoprefixer": "^10.4.12",
    "postcss": "^8.4.20",
    "tailwindcss": "^3.3.2",
    "typescript": "^5.1.6"
  }
}
```

---

## `.env.local` (example)

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/blogvcs?retryWrites=true&w=majority
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## `next.config.js`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

---

## `tailwind.config.ts`

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

---

## `postcss.config.cjs`

```cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## `styles/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #__next {
  height: 100%;
}

body {
  @apply bg-slate-50 text-slate-800;
}
```

---

## `lib/db.ts`

```ts
// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any).mongoose || { conn: null, promise: null };

if (!cached) (global as any).mongoose = cached;

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
```

---

## `models/BlogPost.ts`

```ts
// models/BlogPost.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  currentContent: string; // stored as HTML string
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema: Schema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    currentContent: { type: String, default: '' },
  },
  { timestamps: true }
);

export const BlogPost: Model<IBlogPost> = (mongoose.models.BlogPost as Model<IBlogPost>) || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
```

---

## `models/Version.ts`

```ts
// models/Version.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVersion extends Document {
  blogId: mongoose.Types.ObjectId;
  content: string; // HTML string
  createdAt: Date;
}

const VersionSchema: Schema = new Schema<IVersion>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: 'BlogPost', required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Version: Model<IVersion> = (mongoose.models.Version as Model<IVersion>) || mongoose.model<IVersion>('Version', VersionSchema);
```

---

## `lib/versionControl.ts`

```ts
// lib/versionControl.ts
import dbConnect from './db';
import { BlogPost, IBlogPost } from '../models/BlogPost';
import { Version, IVersion } from '../models/Version';
import type mongoose from 'mongoose';
import DiffMatchPatch from 'diff-match-patch';

export async function saveVersion(blogId: string | null, title: string, content: string) {
  await dbConnect();

  let blog: IBlogPost | null = null;

  if (blogId) {
    blog = await BlogPost.findById(blogId);
  }

  if (!blog) {
    // create new blog
    blog = await BlogPost.create({ title, currentContent: content });
  } else {
    blog.currentContent = content;
    await blog.save();
  }

  const version = await Version.create({ blogId: blog._id, content });

  return { blog, version };
}

export async function getVersions(blogId: string) {
  await dbConnect();
  const versions = await Version.find({ blogId }).sort({ createdAt: -1 }).lean();
  return versions;
}

export async function getVersionById(versionId: string) {
  await dbConnect();
  const version = await Version.findById(versionId).lean();
  return version;
}

export function compareHtml(htmlA: string, htmlB: string) {
  // Use diff-match-patch to produce diffs
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(htmlA || '', htmlB || '');
  dmp.diff_cleanupSemantic(diffs);

  // Transform to HTML with highlights
  let result = '';
  for (const [op, text] of diffs as any[]) {
    if (op === DiffMatchPatch.DIFF_INSERT) {
      result += `<ins class=\"vcs-insert\">${escapeHtml(text)}</ins>`;
    } else if (op === DiffMatchPatch.DIFF_DELETE) {
      result += `<del class=\"vcs-delete\">${escapeHtml(text)}</del>`;
    } else {
      result += escapeHtml(text);
    }
  }
  return result;
}

export async function revertVersion(blogId: string, versionId: string) {
  await dbConnect();
  const version = await Version.findById(versionId);
  if (!version) throw new Error('Version not found');

  const blog = await BlogPost.findById(blogId);
  if (!blog) throw new Error('Blog not found');

  blog.currentContent = version.content;
  await blog.save();

  const newVersion = await Version.create({ blogId: blog._id, content: version.content });

  return { blog, newVersion };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
```

---

## API routes (App Router style)

### `app/api/save-version/route.ts`

```ts
// app/api/save-version/route.ts
import { NextResponse } from 'next/server';
import { saveVersion } from '@/lib/versionControl';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blogId, title, content } = body;
    const res = await saveVersion(blogId ?? null, title, content);
    return NextResponse.json({ ok: true, blog: res.blog, version: res.version });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
```

### `app/api/get-versions/route.ts`

```ts
// app/api/get-versions/route.ts
import { NextResponse } from 'next/server';
import { getVersions } from '@/lib/versionControl';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const blogId = url.searchParams.get('blogId');
    if (!blogId) return NextResponse.json({ ok: false, error: 'blogId required' }, { status: 400 });

    const versions = await getVersions(blogId);
    return NextResponse.json({ ok: true, versions });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
```

### `app/api/compare-versions/route.ts`

```ts
// app/api/compare-versions/route.ts
import { NextResponse } from 'next/server';
import { getVersionById, compareHtml } from '@/lib/versionControl';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const a = url.searchParams.get('a');
    const b = url.searchParams.get('b');
    if (!a || !b) return NextResponse.json({ ok: false, error: 'a and b are required' }, { status: 400 });

    const va = await getVersionById(a);
    const vb = await getVersionById(b);
    if (!va || !vb) return NextResponse.json({ ok: false, error: 'version not found' }, { status: 404 });

    const diffHtml = compareHtml(va.content, vb.content);
    return NextResponse.json({ ok: true, diffHtml });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
```

### `app/api/revert-version/route.ts`

```ts
// app/api/revert-version/route.ts
import { NextResponse } from 'next/server';
import { revertVersion } from '@/lib/versionControl';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blogId, versionId } = body;
    if (!blogId || !versionId) return NextResponse.json({ ok: false, error: 'blogId and versionId required' }, { status: 400 });

    const res = await revertVersion(blogId, versionId);
    return NextResponse.json({ ok: true, blog: res.blog, version: res.newVersion });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
```

---

## `components/Editor.tsx`

```tsx
// components/Editor.tsx
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
```

---

## `components/VersionList.tsx`

```tsx
// components/VersionList.tsx
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
```

---

## `components/DiffViewer.tsx`

```tsx
// components/DiffViewer.tsx
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
```

---

## `app/editor/page.tsx`

```tsx
// app/editor/page.tsx
import React from 'react';
import EditorComponent from '@/components/Editor';

export const metadata = { title: 'Editor' };

export default async function EditorPage() {
  // Server component can fetch initial blog if needed. For simplicity we render client Editor and interact with APIs.
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Blog Editor</h1>
      {/* Editor is client-component - import below will use 'use client' */}
      <EditorWrapper />
    </div>
  );
}

function EditorWrapper() {
  'use client';
  const [blogId, setBlogId] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<string | null>(null);

  const handleSave = async ({ blogId: bId, title, content }: { blogId?: string | null; title: string; content: string }) => {
    const res = await fetch('/api/save-version', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId: bId, title, content }),
    });
    const json = await res.json();
    if (json.ok) {
      setBlogId(json.blog._id);
      setNotification('Saved version ✔');
      setTimeout(() => setNotification(null), 2000);
    } else {
      setNotification('Error saving');
    }
  };

  return (
    <div>
      {notification && <div className="mb-2 text-sm text-green-600">{notification}</div>}
      <EditorComponent initialHtml={''} title={''} onSave={handleSave} blogId={blogId} />
    </div>
  );
}
```

---

## `app/versions/page.tsx`

```tsx
// app/versions/page.tsx
import React from 'react';
import VersionList from '@/components/VersionList';
import DiffViewer from '@/components/DiffViewer';

export const metadata = { title: 'Versions' };

export default function VersionsPage() {
  'use client';
  const [blogId, setBlogId] = React.useState<string | null>(null);
  const [versions, setVersions] = React.useState<any[]>([]);
  const [selectedHtml, setSelectedHtml] = React.useState<string>('');

  const fetchVersions = async (id: string) => {
    const res = await fetch(`/api/get-versions?blogId=${id}`);
    const json = await res.json();
    if (json.ok) setVersions(json.versions);
  };

  const handleLoad = async () => {
    if (!blogId) return;
    await fetchVersions(blogId);
  };

  const handleView = async (id: string) => {
    const res = await fetch(`/api/get-versions?blogId=${blogId}`);
    const json = await res.json();
    const v = json.versions.find((x: any) => x._id === id);
    setSelectedHtml(v.content);
  };

  const handleCompare = (id: string) => {
    // set selection for compare route
    // simple approach: open compare page with query params
    window.location.href = `/compare?a=${id}` + (blogId ? `&blogId=${blogId}` : '');
  };

  const handleRevert = async (id: string) => {
    if (!blogId) return alert('Set blogId first');
    const res = await fetch('/api/revert-version', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId, versionId: id }),
    });
    const json = await res.json();
    if (json.ok) {
      alert('Reverted and new version created');
      await fetchVersions(blogId);
    } else {
      alert('Error reverting');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Version History</h1>

      <div className="mb-4">
        <input value={blogId ?? ''} onChange={(e) => setBlogId(e.target.value)} placeholder="Blog ID" className="p-2 border rounded mr-2" />
        <button onClick={handleLoad} className="px-3 py-2 bg-sky-600 text-white rounded">Load Versions</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <VersionList versions={versions} onView={handleView} onCompare={handleCompare} onRevert={handleRevert} />
        </div>
        <div className="col-span-2">
          <div className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Preview</h3>
            <div className="border p-3 rounded min-h-[300px]" dangerouslySetInnerHTML={{ __html: selectedHtml }} />
          </div>

          <div className="mt-4">
            <DiffViewer html={''} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## `app/compare/page.tsx`

```tsx
// app/compare/page.tsx
'use client';
import React from 'react';
import DiffViewer from '@/components/DiffViewer';

export default function ComparePage() {
  const [a, setA] = React.useState<string | null>(null);
  const [b, setB] = React.useState<string | null>(null);
  const [diffHtml, setDiffHtml] = React.useState<string>('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aa = params.get('a');
    const bb = params.get('b');
    if (aa) setA(aa);
    if (bb) setB(bb);
  }, []);

  const runCompare = async () => {
    if (!a || !b) return alert('please set both version ids');
    const res = await fetch(`/api/compare-versions?a=${a}&b=${b}`);
    const json = await res.json();
    if (json.ok) setDiffHtml(json.diffHtml);
    else alert('error');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Compare Versions</h1>

      <div className="mb-4 flex gap-2">
        <input placeholder="Version A id" value={a ?? ''} onChange={(e) => setA(e.target.value)} className="p-2 border rounded" />
        <input placeholder="Version B id" value={b ?? ''} onChange={(e) => setB(e.target.value)} className="p-2 border rounded" />
        <button onClick={runCompare} className="px-3 py-2 bg-sky-600 text-white rounded">Compare</button>
      </div>

      <DiffViewer html={diffHtml} />
    </div>
  );
}
```

---

## `README.md`

````md
# Blog Version Control System

**Stack:** Next.js 15 (App Router) + TypeScript + MongoDB + Mongoose + TipTap + diff-match-patch

## Quick start

1. Clone

```bash
git clone <repo-url>
cd blog-vcs
````

2. Install

```bash
npm install
```

3. Create `.env.local` with:

```
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run

```bash
npm run dev
```

Open [http://localhost:3000/editor](http://localhost:3000/editor) to start editing.

## Features

* Rich text editor (TipTap)
* Save versions to MongoDB
* List versions
* Compare versions (diff-match-patch)
* Revert to previous version (creates a new version)

## Deploy

1. Push to GitHub.
2. On Vercel, set `MONGODB_URI` in Environment Variables.
3. Deploy.

## Notes

* This is a scaffold; improve UI with ShadCN components and add authentication if needed.
* All content is stored as HTML (TipTap's `getHTML()`), which makes diffing straightforward. For more robust diffs, consider storing markdown or a text-only representation.

```

---

### Final notes

This scaffold contains the main pieces to get started. It follows the structure you requested and uses `diff-match-patch` server-side to compute diffs. The UI is intentionally minimal and uses Tailwind utilities so you can enhance it further with ShadCN components.

If you'd like, I can now:

- Generate improved UI using shadcn/ui components.
- Add Auth.js integration and protected routes.
- Add unit tests and CI config.

Tell me which one you want next.

```
