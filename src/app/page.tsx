import Link from 'next/link';
import { Button } from '@ui/button';
import { Card, CardContent } from '@ui/card';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Blog Version Control System (V1)</h1>
      <p className="text-slate-700">
        Create blog posts, save versions, compare differences, and revert to previous versions.
      </p>
      <div className="flex gap-3">
        <Link href="/editor"><Button>Open Editor</Button></Link>
        <Link href="/versions"><Button variant="outline">View Versions</Button></Link>
        <Link href="/compare"><Button variant="outline">Compare</Button></Link>
      </div>

      <Card>
        <CardContent className="p-4 text-sm text-slate-600">
          Tip: After saving the first version in the editor, copy the displayed <b>Blog ID</b> and
          paste it on the <b>Versions</b> page to load history.
        </CardContent>
      </Card>
    </div>
  );
}
