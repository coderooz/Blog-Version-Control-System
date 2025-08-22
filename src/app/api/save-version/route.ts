// app/api/save-version/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { saveVersion } from '@/lib/versionControl';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { blogId, title, content } = body;
    const res = await saveVersion(blogId ?? null, title, content);
    return NextResponse.json({ ok: true, blog: res.blog, version: res.version });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}