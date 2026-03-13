import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/db';
import { notifySubscribersOfNewPost } from '@/lib/subscription-notify';
import { requireAdminApiSession } from '@/lib/require-admin-api';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAllPosts } from '@/lib/posts';

function toStaticPostPayload() {
  return getAllPosts().map((post) => ({
    id: post.slug,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags.split(',').map((tag) => ({ id: tag.trim().toLowerCase(), name: tag.trim() })),
  }));
}

export async function GET() {
  try {
    const dbPosts = await prisma.post.findMany({
      include: {
        tags: true,
      },
      orderBy: { date: 'desc' },
    });

    const posts = dbPosts.length > 0 ? dbPosts : toStaticPostPayload();

    return NextResponse.json({ success: true, posts, source: dbPosts.length > 0 ? 'database' : 'static' });
  } catch (error) {
    console.error('[API/POSTS] GET Error:', error);
    return NextResponse.json({ success: true, posts: toStaticPostPayload(), source: 'static' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const limited = checkRateLimit(request, {
      key: 'posts:post',
      windowMs: 60_000,
      max: 20,
    });
    if (limited) {
      return limited;
    }

    const unauthorized = requireAdminApiSession(request);
    if (unauthorized) {
      return unauthorized;
    }

    const body = await request.json();
    const { title, slug, excerpt, content, date, tags } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and content are required.' },
        { status: 400 },
      );
    }

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This slug already exists.' },
        { status: 400 },
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        date: date || new Date().toISOString().split('T')[0],
        tags: {
          connectOrCreate: (tags || []).map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/posts');
    revalidatePath('/timeline');
    revalidateTag('posts');

    try {
      const notifyResult = await notifySubscribersOfNewPost({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
      });
      if (notifyResult.enabled) {
        console.info(
          `[SUBSCRIPTIONS] notify attempted=${notifyResult.attempted} delivered=${notifyResult.delivered}`,
        );
      }
    } catch (notifyError) {
      console.error('[SUBSCRIPTIONS] notify failed:', notifyError);
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('[API/POSTS] POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const limited = checkRateLimit(request, {
      key: 'posts:put',
      windowMs: 60_000,
      max: 30,
    });
    if (limited) {
      return limited;
    }

    const unauthorized = requireAdminApiSession(request);
    if (unauthorized) {
      return unauthorized;
    }

    const body = await request.json();
    const { slug, title, excerpt, content, tags } = body;

    const post = await prisma.post.findUnique({
      where: { slug },
      include: { tags: true },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found.' },
        { status: 404 },
      );
    }

    const updated = await prisma.post.update({
      where: { slug },
      data: {
        title: title || post.title,
        excerpt: excerpt ?? post.excerpt,
        content: content || post.content,
        tags: {
          set: [],
          connectOrCreate: (tags || []).map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/posts');
    revalidatePath('/timeline');

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('[API/POSTS] PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const limited = checkRateLimit(request, {
      key: 'posts:delete',
      windowMs: 60_000,
      max: 20,
    });
    if (limited) {
      return limited;
    }

    const unauthorized = requireAdminApiSession(request);
    if (unauthorized) {
      return unauthorized;
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required.' },
        { status: 400 },
      );
    }

    await prisma.post.delete({ where: { slug } });

    revalidatePath('/', 'layout');
    revalidatePath('/posts');
    revalidatePath('/timeline');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API/POSTS] DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post.' },
      { status: 500 },
    );
  }
}
