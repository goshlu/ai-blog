import type { MetadataRoute } from 'next';
import prisma from '@/lib/db';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-blog-five-sigma.vercel.app';

function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, notes] = await Promise.all([
    prisma.post.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),
    prisma.note.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: toAbsoluteUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: toAbsoluteUrl('/posts'),
      lastModified: posts[0]?.updatedAt ?? new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl('/timeline'),
      lastModified: posts[0]?.updatedAt ?? new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: toAbsoluteUrl('/notes'),
      lastModified: notes[0]?.updatedAt ?? new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl('/thoughts'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: toAbsoluteUrl('/more'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: toAbsoluteUrl(`/posts/${post.id}`),
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const noteRoutes: MetadataRoute.Sitemap = notes.map((note) => ({
    url: toAbsoluteUrl(`/notes/${note.id}`),
    lastModified: note.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...noteRoutes];
}
