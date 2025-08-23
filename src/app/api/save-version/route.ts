import { NextResponse } from 'next/server';
import { saveVersion } from '@/lib/versionControl';

export async function POST(request: Request) {
  try {
    const { blogId, title, content } = await request.json();
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ ok: false, error: 'title required' }, { status: 400 });
    }
    const { blog, version } = await saveVersion(blogId ?? null, title.trim(), content ?? '');
    return NextResponse.json({ ok: true, blog, version });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'unknown error' }, { status: 500 });
  }
}
