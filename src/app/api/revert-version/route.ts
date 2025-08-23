import { NextResponse } from 'next/server';
import { revertVersion } from '@/lib/versionControl';

export async function POST(request: Request) {
  try {
    const { blogId, versionId } = await request.json();
    if (!blogId || !versionId) return NextResponse.json({ ok: false, error: 'blogId and versionId required' }, { status: 400 });

    const { blog, newVersion } = await revertVersion(blogId, versionId);
    return NextResponse.json({ ok: true, blog, version: newVersion });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? 'unknown error' }, { status: 500 });
  }
}
