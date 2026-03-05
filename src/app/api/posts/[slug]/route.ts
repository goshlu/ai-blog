import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });
  
  if (!post) {
    return NextResponse.json(
      { success: false, error: '文章不存在' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({ success: true, post });
}
