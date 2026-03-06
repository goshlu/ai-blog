import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
    return NextResponse.json({ success: true, tags });
  } catch (error) {
    console.error('Fetch tags error:', error);
    return NextResponse.json({ success: false, error: '获取标签失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ success: false, error: '标签名称不能为空' }, { status: 400 });

    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name }
    });
    return NextResponse.json({ success: true, tag });
  } catch (error) {
    console.error('Create tag error:', error);
    return NextResponse.json({ success: false, error: '创建标签失败' }, { status: 500 });
  }
}
