import { describe, it, expect } from "vitest";
import { cn, formatDate, normalizeEmail } from "../utils";

describe("cn (className merger)", () => {
  it("应该合并多个类名", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("应该处理条件类名", () => {
    expect(cn("base", true && "active", false && "disabled")).toBe(
      "base active",
    );
  });

  it("应该处理 Tailwind 冲突类名", () => {
    // twMerge 会自动处理冲突的 Tailwind 类
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("应该处理对象形式的类名", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
  });

  it("应该处理空值", () => {
    expect(cn("", null, undefined, "valid")).toBe("valid");
  });
});

describe("formatDate", () => {
  it("应该格式化日期为中文格式", () => {
    const result = formatDate("2024-01-15");
    expect(result).toContain("2024");
    expect(result).toContain("1");
    expect(result).toContain("15");
  });

  it("应该处理不同的日期格式", () => {
    expect(formatDate("2024-03-06")).toBeTruthy();
    expect(formatDate("2024/03/06")).toBeTruthy();
  });

  it("应该返回有效的日期字符串", () => {
    const result = formatDate("2024-12-25");
    expect(result).not.toBe("Invalid Date");
    expect(typeof result).toBe("string");
  });
});

describe("normalizeEmail", () => {
  it("应该转换为小写", () => {
    expect(normalizeEmail("TEST@EXAMPLE.COM")).toBe("test@example.com");
    expect(normalizeEmail("User@Domain.COM")).toBe("user@domain.com");
  });

  it("应该移除首尾空格", () => {
    expect(normalizeEmail("  test@example.com  ")).toBe("test@example.com");
    expect(normalizeEmail("\tuser@domain.com\n")).toBe("user@domain.com");
  });

  it("应该同时处理空格和大小写", () => {
    expect(normalizeEmail("  TEST@EXAMPLE.COM  ")).toBe("test@example.com");
  });

  it("应该处理空字符串", () => {
    expect(normalizeEmail("")).toBe("");
    expect(normalizeEmail("   ")).toBe("");
  });

  it("应该保持有效邮箱格式不变", () => {
    expect(normalizeEmail("user@example.com")).toBe("user@example.com");
  });
});
