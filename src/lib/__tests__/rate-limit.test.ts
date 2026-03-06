import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { checkRateLimit } from "../rate-limit";

// Mock NextRequest
function createMockRequest(ip?: string): NextRequest {
  const headers = new Headers();
  if (ip) {
    headers.set("x-forwarded-for", ip);
  }

  return new NextRequest("http://localhost:3000/api/test", {
    headers,
  });
}

describe("checkRateLimit", () => {
  beforeEach(() => {
    // 清理全局存储
    const globalForRateLimit = globalThis as {
      __rateLimitStore?: Map<string, unknown>;
    };
    if (globalForRateLimit.__rateLimitStore) {
      globalForRateLimit.__rateLimitStore.clear();
    }
  });

  it("应该允许首次请求", () => {
    const request = createMockRequest("192.168.1.1");
    const result = checkRateLimit(request, {
      key: "test",
      windowMs: 60000,
      max: 5,
    });

    expect(result).toBeNull();
  });

  it("应该在限制内允许多次请求", () => {
    const request = createMockRequest("192.168.1.2");
    const options = {
      key: "test",
      windowMs: 60000,
      max: 3,
    };

    expect(checkRateLimit(request, options)).toBeNull();
    expect(checkRateLimit(request, options)).toBeNull();
    expect(checkRateLimit(request, options)).toBeNull();
  });

  it("应该在超过限制时返回 429 响应", () => {
    const request = createMockRequest("192.168.1.3");
    const options = {
      key: "test",
      windowMs: 60000,
      max: 2,
    };

    // 前两次应该成功
    expect(checkRateLimit(request, options)).toBeNull();
    expect(checkRateLimit(request, options)).toBeNull();

    // 第三次应该被限制
    const result = checkRateLimit(request, options);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(429);
  });

  it("应该为不同 IP 分别计数", () => {
    const request1 = createMockRequest("192.168.1.4");
    const request2 = createMockRequest("192.168.1.5");
    const options = {
      key: "test",
      windowMs: 60000,
      max: 1,
    };

    expect(checkRateLimit(request1, options)).toBeNull();
    expect(checkRateLimit(request2, options)).toBeNull();

    // 各自的第二次请求应该被限制
    expect(checkRateLimit(request1, options)?.status).toBe(429);
    expect(checkRateLimit(request2, options)?.status).toBe(429);
  });

  it("应该为不同 key 分别计数", () => {
    const request = createMockRequest("192.168.1.6");

    expect(
      checkRateLimit(request, { key: "api1", windowMs: 60000, max: 1 }),
    ).toBeNull();
    expect(
      checkRateLimit(request, { key: "api2", windowMs: 60000, max: 1 }),
    ).toBeNull();

    // 同一个 key 的第二次请求应该被限制
    expect(
      checkRateLimit(request, { key: "api1", windowMs: 60000, max: 1 })?.status,
    ).toBe(429);
  });

  it("应该在时间窗口过期后重置计数", () => {
    vi.useFakeTimers();

    const request = createMockRequest("192.168.1.7");
    const options = {
      key: "test",
      windowMs: 1000, // 1 秒
      max: 1,
    };

    // 首次请求成功
    expect(checkRateLimit(request, options)).toBeNull();

    // 立即第二次请求被限制
    expect(checkRateLimit(request, options)?.status).toBe(429);

    // 时间前进 1.1 秒
    vi.advanceTimersByTime(1100);

    // 应该可以再次请求
    expect(checkRateLimit(request, options)).toBeNull();

    vi.useRealTimers();
  });

  it("应该处理没有 IP 的请求", () => {
    const request = createMockRequest();
    const result = checkRateLimit(request, {
      key: "test",
      windowMs: 60000,
      max: 5,
    });

    expect(result).toBeNull();
  });

  it("应该在响应中包含 Retry-After 头", () => {
    const request = createMockRequest("192.168.1.8");
    const options = {
      key: "test",
      windowMs: 60000,
      max: 1,
    };

    checkRateLimit(request, options);
    const result = checkRateLimit(request, options);

    expect(result?.headers.get("Retry-After")).toBeTruthy();
  });
});
