import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string | null;
}

interface Note {
  id: string;
  title: string;
  date: string;
}

// GET - 搜索文章
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q')?.trim();
  const type = searchParams.get('type') || 'all';

  if (!q || q.length < 1) {
    return NextResponse.json({ success: false, error: '搜索关键词不能为空' }, { status: 400 });
  }

  try {
    const results: { posts: Post[]; notes: Note[] } = { posts: [], notes: [] };

    if (type === 'all' || type === 'posts') {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
            { excerpt: { contains: q } },
          ],
        },
        orderBy: { date: 'desc' },
        take: 20,
      });
      results.posts = posts;
    }

    if (type === 'all' || type === 'notes') {
      const notes = await prisma.note.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        orderBy: { date: 'desc' },
        take: 20,
      });
      results.notes = notes;
    }

    return NextResponse.json({ success: true, query: q, results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: '搜索失败' }, { status: 500 });
  }
}
