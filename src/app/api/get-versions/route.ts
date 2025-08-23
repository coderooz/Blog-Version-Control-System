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
    return NextResponse.json({ ok: false, error: err?.message ?? 'unknown error' }, { status: 500 });
  }
}
