import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionMaxAgeSeconds,
  isAdminAuthConfigured,
  verifyAdminPassword,
} from '@/lib/admin-auth';
import { checkRateLimit } from '@/lib/rate-limit';

function sanitizeRedirectTarget(raw: string) {
  if (raw.startsWith('/admin')) {
    return raw;
  }
  return '/admin';
}

export async function POST(request: NextRequest) {
  try {
    const limited = checkRateLimit(request, {
      key: 'admin:login:post',
      windowMs: 10 * 60_000,
      max: 20,
    });
    if (limited) {
      return limited;
    }

    if (!isAdminAuthConfigured()) {
      return NextResponse.json(
        { success: false, error: '后台鉴权未配置：请设置 ADMIN_PASSWORD' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const password = String(body?.password || '');
    const next = sanitizeRedirectTarget(String(body?.next || '/admin'));

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      redirectTo: next,
    });

    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: createAdminSessionToken(),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: getAdminSessionMaxAgeSeconds(),
    });

    return response;
  } catch (error) {
    console.error('[API/ADMIN/LOGIN] POST Error:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 },
    );
  }
}
