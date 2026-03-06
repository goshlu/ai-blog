import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 64;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const limited = checkRateLimit(request, {
      key: 'subscriptions:post',
      windowMs: 60_000,
      max: 8,
    });
    if (limited) {
      return limited;
    }

    const body = await request.json();
    const email = normalizeEmail(String(body?.email || ''));
    const name = String(body?.name || '').trim().slice(0, MAX_NAME_LENGTH);

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: '请输入有效邮箱地址' },
        { status: 400 },
      );
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });

    if (!existing) {
      const subscriber = await prisma.subscriber.create({
        data: {
          email,
          name: name || null,
          isActive: true,
        },
      });

      return NextResponse.json({
        success: true,
        status: 'subscribed',
        subscriber: { email: subscriber.email, name: subscriber.name },
        message: '订阅成功，后续会邮件通知你。',
      });
    }

    if (existing.isActive) {
      return NextResponse.json({
        success: true,
        status: 'already-subscribed',
        message: '该邮箱已订阅。',
      });
    }

    const subscriber = await prisma.subscriber.update({
      where: { email },
      data: {
        isActive: true,
        name: name || existing.name,
        unsubscribedAt: null,
        subscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      status: 'reactivated',
      subscriber: { email: subscriber.email, name: subscriber.name },
      message: '已恢复订阅。',
    });
  } catch (error) {
    console.error('[API/SUBSCRIPTIONS] POST Error:', error);
    return NextResponse.json(
      { success: false, error: '订阅失败，请稍后重试。' },
      { status: 500 },
    );
  }
}
