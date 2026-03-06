import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { requireAdminApiSession } from "../require-admin-api";
import { createAdminSessionToken, ADMIN_SESSION_COOKIE } from "../admin-auth";

function createMockRequest(token?: string): NextRequest {
  const headers = new Headers();
  const cookies = new Map();

  if (token) {
    cookies.set(ADMIN_SESSION_COOKIE, token);
  }

  const request = new NextRequest("http://localhost:3000/api/admin/test", {
    headers,
  });

  // Mock cookies
  if (token) {
    Object.defineProperty(request, "cookies", {
      value: {
        get: (name: string) => {
          if (name === ADMIN_SESSION_COOKIE) {
            return { value: token };
          }
          return undefined;
        },
      },
    });
  }

  return request;
}

describe("requireAdminApiSession", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.ADMIN_PASSWORD = "test-password-123";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("应该拒绝没有 token 的请求", () => {
    const request = createMockRequest();
    const result = requireAdminApiSession(request);

    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);
  });

  it("应该拒绝无效 token 的请求", () => {
    const request = createMockRequest("invalid-token");
    const result = requireAdminApiSession(request);

    expect(result).not.toBeNull();
    expect(result?.status).toBe(401);
  });

  it("应该允许有效 token 的请求", () => {
    const validToken = createAdminSessionToken();
    const request = createMockRequest(validToken);
    const result = requireAdminApiSession(request);

    expect(result).toBeNull();
  });

  it("应该在未配置管理员密码时返回 500", () => {
    delete process.env.ADMIN_PASSWORD;

    const request = createMockRequest();
    const result = requireAdminApiSession(request);

    expect(result).not.toBeNull();
    expect(result?.status).toBe(500);
  });

  it("应该返回正确的错误消息", async () => {
    const request = createMockRequest();
    const result = requireAdminApiSession(request);

    expect(result).not.toBeNull();
    const json = await result?.json();
    expect(json).toHaveProperty("success", false);
    expect(json).toHaveProperty("error");
  });
});
