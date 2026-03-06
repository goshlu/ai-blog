import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-blog-five-sigma.vercel.app';
const SITE_TITLE = 'YSKM Blog';
const SITE_DESCRIPTION = '分享技术，记录生活。';
const FEED_PATH = '/feed.xml';

export const revalidate = 3600;

function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function escapeCdata(value: string) {
  return value.replace(/]]>/g, ']]]]><![CDATA[>');
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~\-]+/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildDescription(excerpt: string | null, content: string) {
  const summary = excerpt?.trim() || stripMarkdown(content);
  return summary.slice(0, 240);
}

export async function GET() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      date: true,
      updatedAt: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const lastBuildDate = posts[0]?.updatedAt ?? new Date();

  const items = posts
    .map((post) => {
      const url = toAbsoluteUrl(`/posts/${post.id}`);
      const pubDate = new Date(post.date || post.createdAt);
      const description = buildDescription(post.excerpt, post.content);

      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${pubDate.toUTCString()}</pubDate>`,
        `      <description>${escapeXml(description)}</description>`,
        `      <content:encoded><![CDATA[${escapeCdata(description)}]]></content:encoded>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>${escapeXml(SITE_TITLE)}</title>`,
    `    <link>${escapeXml(SITE_URL)}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    '    <language>zh-CN</language>',
    `    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(toAbsoluteUrl(FEED_PATH))}" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
