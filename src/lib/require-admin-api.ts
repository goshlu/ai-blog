import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  isAdminAuthConfigured,
  verifyAdminSessionToken,
} from "./admin-auth";

/**
 * 验证管理员身份的中间件
 * 用于保护需要管理员权限的 API 路由
 */
export async function requireAdmin() {
  // 检查是否配置了管理员密码
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { success: false, error: "管理员认证未配置" },
      { status: 500 },
    );
  }

  // 获取并验证 session token
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token || !verifyAdminSessionToken(token)) {
    return NextResponse.json(
      { success: false, error: "未授权：请先登录管理后台" },
      { status: 401 },
    );
  }

  // 验证通过，返回 null 表示可以继续处理请求
  return null;
}

/**
 * 同步版本的管理员验证（用于已有 request 对象的场景）
 * 从 request.cookies 读取 token
 */
export function requireAdminApiSession(
  request: NextRequest,
): NextResponse | null {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { success: false, error: "管理员认证未配置" },
      { status: 500 },
    );
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token || !verifyAdminSessionToken(token)) {
    return NextResponse.json(
      { success: false, error: "未授权：请先登录管理后台" },
      { status: 401 },
    );
  }

  return null;
}

/**
 * 从请求中获取管理员 session token（用于客户端请求）
 */
export function getAdminTokenFromRequest(
  request: NextRequest,
): string | undefined {
  return request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
}

/**
 * 验证管理员 token 是否有效
 */
export function isValidAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  return verifyAdminSessionToken(token);
}
