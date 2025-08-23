import dbConnect from '@/lib/db';
import { BlogPost, IBlogPost } from '@/models/BlogPost';
import { Version, IVersion } from '@/models/Version';
import DiffMatchPatch from 'diff-match-patch';

export async function saveVersion(blogId: string | null, title: string, content: string) {
  await dbConnect();

  let blog: IBlogPost & { _id: any } | null = null;
  if (blogId) blog = (await BlogPost.findById(blogId)) as any;

  if (!blog) {
    blog = (await BlogPost.create({ title, currentContent: content })) as any;
  } else {
    await BlogPost.updateOne({ _id: blogId }, { $set: { title, currentContent: content } });
  }

  const version = await Version.create({ blogId: (blog as any)._id, content });
  return { blog, version };
}

export async function getVersions(blogId: string) {
  await dbConnect();
  return Version.find({ blogId }).sort({ createdAt: -1 }).lean<IVersion[]>();
}

export async function getVersionById(versionId: string) {
  await dbConnect();
  return Version.findById(versionId).lean<IVersion | null>();
}

export function compareHtml(htmlA: string, htmlB: string) {
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(htmlA || '', htmlB || '');
  dmp.diff_cleanupSemantic(diffs);

  let result = '';
  for (const [op, text] of diffs as any[]) {
    if (op === DiffMatchPatch.DIFF_INSERT) {
      result += `<ins class="vcs-ins">${escapeHtml(text)}</ins>`;
    } else if (op === DiffMatchPatch.DIFF_DELETE) {
      result += `<del class="vcs-del">${escapeHtml(text)}</del>`;
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

  await BlogPost.updateOne({ _id: blogId }, { $set: { currentContent: version.content } });
  const newVersion = await Version.create({ blogId, content: version.content });

  const blog = await BlogPost.findById(blogId);
  return { blog, newVersion };
}

function escapeHtml(str: string) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
