import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  verifyAdminPassword,
  createAdminSessionToken,
  verifyAdminSessionToken,
  isAdminAuthConfigured,
  getAdminSessionMaxAgeSeconds,
} from "../admin-auth";

describe("Admin Authentication", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isAdminAuthConfigured", () => {
    it("应该在设置了 ADMIN_PASSWORD 时返回 true", () => {
      process.env.ADMIN_PASSWORD = "test-password";
      expect(isAdminAuthConfigured()).toBe(true);
    });

    it("应该在未设置 ADMIN_PASSWORD 时返回 false", () => {
      delete process.env.ADMIN_PASSWORD;
      expect(isAdminAuthConfigured()).toBe(false);
    });

    it("应该在 ADMIN_PASSWORD 为空字符串时返回 false", () => {
      process.env.ADMIN_PASSWORD = "   ";
      expect(isAdminAuthConfigured()).toBe(false);
    });
  });

  describe("verifyAdminPassword", () => {
    it("应该验证正确的密码", () => {
      process.env.ADMIN_PASSWORD = "correct-password";
      expect(verifyAdminPassword("correct-password")).toBe(true);
    });

    it("应该拒绝错误的密码", () => {
      process.env.ADMIN_PASSWORD = "correct-password";
      expect(verifyAdminPassword("wrong-password")).toBe(false);
    });

    it("应该在未配置密码时拒绝所有密码", () => {
      delete process.env.ADMIN_PASSWORD;
      expect(verifyAdminPassword("any-password")).toBe(false);
    });

    it("应该使用时间安全的比较", () => {
      process.env.ADMIN_PASSWORD = "secret";
      // 即使长度不同也应该安全比较
      expect(verifyAdminPassword("sec")).toBe(false);
      expect(verifyAdminPassword("secret123")).toBe(false);
    });
  });

  describe("Session Token", () => {
    beforeEach(() => {
      process.env.ADMIN_PASSWORD = "test-password";
    });

    it("应该创建有效的 session token", () => {
      const token = createAdminSessionToken();
      expect(token).toBeTruthy();
      expect(token).toContain(".");
    });

    it("应该验证有效的 token", () => {
      const token = createAdminSessionToken();
      expect(verifyAdminSessionToken(token)).toBe(true);
    });

    it("应该拒绝无效的 token", () => {
      expect(verifyAdminSessionToken("invalid.token")).toBe(false);
      expect(verifyAdminSessionToken("not-a-token")).toBe(false);
      expect(verifyAdminSessionToken("")).toBe(false);
    });

    it("应该拒绝过期的 token", () => {
      // 创建一个已过期的 token（时间戳为过去）
      const expiredTimestamp = Date.now() - 1000;
      const fakeToken = `${expiredTimestamp}.fakesignature`;
      expect(verifyAdminSessionToken(fakeToken)).toBe(false);
    });

    it("应该拒绝签名错误的 token", () => {
      const validToken = createAdminSessionToken();
      const [timestamp] = validToken.split(".");
      const tamperedToken = `${timestamp}.wrongsignature`;
      expect(verifyAdminSessionToken(tamperedToken)).toBe(false);
    });

    it("应该返回正确的 session 过期时间", () => {
      const maxAge = getAdminSessionMaxAgeSeconds();
      expect(maxAge).toBeGreaterThan(0);
      expect(maxAge).toBe(60 * 60 * 12); // 12 小时
    });
  });
});
