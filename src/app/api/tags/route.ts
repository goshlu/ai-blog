import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdminApiSession } from '@/lib/require-admin-api';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json({ success: true, tags });
  } catch (error) {
    console.error('[API/TAGS] GET Error:', error);
    return NextResponse.json(
      { success: false, error: '获取标签失败' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const limited = checkRateLimit(request, {
      key: 'tags:post',
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

    const { name } = await request.json();
    const normalized = String(name || '').trim();

    if (!normalized) {
      return NextResponse.json(
        { success: false, error: '标签名称不能为空' },
        { status: 400 },
      );
    }

    const tag = await prisma.tag.upsert({
      where: { name: normalized },
      update: {},
      create: { name: normalized },
    });

    return NextResponse.json({ success: true, tag });
  } catch (error) {
    console.error('[API/TAGS] POST Error:', error);
    return NextResponse.json(
      { success: false, error: '创建标签失败' },
      { status: 500 },
    );
  }
}
