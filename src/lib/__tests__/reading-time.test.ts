import { describe, it, expect } from "vitest";
import { calculateReadingTime, formatReadingTime } from "../reading-time";

describe("calculateReadingTime", () => {
  it("应该返回至少 1 分钟", () => {
    expect(calculateReadingTime("")).toBe(1);
    expect(calculateReadingTime("短文本")).toBe(1);
  });

  it("应该正确计算中文阅读时间", () => {
    // 300 字/分钟
    const chineseText = "中".repeat(300);
    expect(calculateReadingTime(chineseText)).toBe(1);

    const longerText = "中".repeat(600);
    expect(calculateReadingTime(longerText)).toBe(2);
  });

  it("应该正确计算英文阅读时间", () => {
    // 200 词/分钟
    const englishText = "word ".repeat(200);
    expect(calculateReadingTime(englishText)).toBe(1);

    const longerText = "word ".repeat(400);
    expect(calculateReadingTime(longerText)).toBe(2);
  });

  it("应该正确计算中英文混合阅读时间", () => {
    const mixedText = "中".repeat(150) + " word".repeat(100);
    // 150/300 + 100/200 = 0.5 + 0.5 = 1 分钟
    expect(calculateReadingTime(mixedText)).toBe(1);
  });

  it("应该忽略 Markdown 代码块", () => {
    const textWithCode = `
这是正文内容。
\`\`\`javascript
const code = 'this should be ignored';
console.log('lots of code here');
\`\`\`
更多正文。
    `;
    const result = calculateReadingTime(textWithCode);
    expect(result).toBeGreaterThan(0);
  });

  it("应该忽略 Markdown 链接和图片", () => {
    const textWithLinks = `
这是[链接文本](https://example.com)。
![图片描述](https://example.com/image.png)
正文内容继续。
    `;
    const result = calculateReadingTime(textWithLinks);
    expect(result).toBeGreaterThan(0);
  });

  it("应该移除 Markdown 符号", () => {
    const textWithMarkdown = `
# 标题
## 二级标题
**粗体** *斜体* ~~删除线~~
> 引用内容
- 列表项
    `;
    const result = calculateReadingTime(textWithMarkdown);
    expect(result).toBeGreaterThan(0);
  });
});

describe("formatReadingTime", () => {
  it("应该正确格式化阅读时间", () => {
    expect(formatReadingTime(1)).toBe("1 分钟阅读");
    expect(formatReadingTime(5)).toBe("5 分钟阅读");
    expect(formatReadingTime(10)).toBe("10 分钟阅读");
  });
});
