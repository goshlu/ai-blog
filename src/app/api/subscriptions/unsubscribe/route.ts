import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

async function unsubscribeByEmail(emailInput: string) {
  const email = normalizeEmail(emailInput);
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { success: false, error: '邮箱格式不正确' },
      { status: 400 },
    );
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (!existing || !existing.isActive) {
    return NextResponse.json({
      success: true,
      status: 'already-unsubscribed',
      message: '该邮箱未处于订阅状态。',
    });
  }

  await prisma.subscriber.update({
    where: { email },
    data: {
      isActive: false,
      unsubscribedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    status: 'unsubscribed',
    message: '你已成功退订。',
  });
}

export async function POST(request: NextRequest) {
  try {
    const limited = checkRateLimit(request, {
      key: 'subscriptions:unsubscribe:post',
      windowMs: 60_000,
      max: 8,
    });
    if (limited) {
      return limited;
    }

    const body = await request.json();
    return unsubscribeByEmail(String(body?.email || ''));
  } catch (error) {
    console.error('[API/SUBSCRIPTIONS/UNSUBSCRIBE] POST Error:', error);
    return NextResponse.json(
      { success: false, error: '退订失败，请稍后重试。' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const limited = checkRateLimit(request, {
      key: 'subscriptions:unsubscribe:get',
      windowMs: 60_000,
      max: 12,
    });
    if (limited) {
      return limited;
    }

    const email = request.nextUrl.searchParams.get('email') || '';
    return unsubscribeByEmail(email);
  } catch (error) {
    console.error('[API/SUBSCRIPTIONS/UNSUBSCRIBE] GET Error:', error);
    return NextResponse.json(
      { success: false, error: '退订失败，请稍后重试。' },
      { status: 500 },
    );
  }
}
