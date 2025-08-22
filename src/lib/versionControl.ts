import dbConnect from '@lib/db';
import { BlogPost, IBlogPost } from '@models/BlogPost';
import { Version, IVersion } from '@models/Version';
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