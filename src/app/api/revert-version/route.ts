// app/api/revert-version/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revertVersion } from '@/lib/versionControl';

export async function POST(request: NextRequest) {
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