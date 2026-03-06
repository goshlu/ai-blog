import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from '@/lib/admin-auth';

export function requireAdminApiSession(request: NextRequest) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Admin auth is not configured. Please set ADMIN_PASSWORD.' },
      { status: 500 },
    );
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !verifyAdminSessionToken(token)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please sign in as admin first.' },
      { status: 401 },
    );
  }

  return null;
}
