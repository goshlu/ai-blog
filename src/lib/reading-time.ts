/**
 * 计算阅读时间
 * 中文按 300 字/分钟，英文按 200 词/分钟
 * @param content 文章内容
 * @returns 阅读时间（分钟）
 */
export function calculateReadingTime(content: string): number {
  if (!content) return 1;

  // 移除 Markdown 标记
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/`[^`]*`/g, '') // 行内代码
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接
    .replace(/[#*_~>|-]/g, '') // Markdown 符号
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '') // 图片
    .trim();

  // 统计中文字符
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 统计英文单词
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length;

  // 中文 300 字/分钟，英文 200 词/分钟
  const chineseMinutes = chineseChars / 300;
  const englishMinutes = englishWords / 200;

  const totalMinutes = Math.ceil(chineseMinutes + englishMinutes);

  // 最少 1 分钟
  return Math.max(1, totalMinutes);
}

/**
 * 格式化阅读时间
 * @param minutes 分钟数
 * @returns 格式化字符串，如 "3 分钟阅读"
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} 分钟阅读`;
}
