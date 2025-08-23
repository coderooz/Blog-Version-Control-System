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
    return NextResponse.json({ ok: false, error: err?.message ?? 'unknown error' }, { status: 500 });
  }
}
