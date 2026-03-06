import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import prisma from '@/lib/db';

// GET - 获取所有文章
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        tags: true,
      },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('[API/POSTS] GET Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: '获取文章失败',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST - 创建新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, date, tags } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: '标题、Slug 和内容为必填项' },
        { status: 400 }
      );
    }

    // 检查 slug 是否已存在
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: '该 Slug 已存在' },
        { status: 400 }
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

    // 刷新页面缓存
    revalidatePath('/', 'layout');
    revalidatePath('/posts');
    revalidatePath('/timeline');
    revalidateTag('posts');

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json(
      { success: false, error: '创建失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新文章
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, excerpt, content, tags } = body;

    const post = await prisma.post.findUnique({ 
      where: { slug },
      include: { tags: true } 
    });
    
    if (!post) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      );
    }

    const updated = await prisma.post.update({
      where: { slug },
      data: {
        title: title || post.title,
        excerpt: excerpt ?? post.excerpt,
        content: content || post.content,
        tags: {
          set: [], // 先清空现有关联
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
    console.error('Update post error:', error);
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除文章
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug 为必填项' },
        { status: 400 }
      );
    }

    await prisma.post.delete({ where: { slug } });

    revalidatePath('/', 'layout');
    revalidatePath('/posts');
    revalidatePath('/timeline');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    );
  }
}
