export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function extractHeadings(content: string): HeadingItem[] {
  return content
    .split('\n')
    .map((line) => {
      const match = /^(#{1,6})\s+(.+)$/.exec(line.trim());
      if (!match) return null;

      const level = match[1].length;
      const text = match[2].trim();
      if (level > 3) return null;

      return {
        id: slugifyHeading(text),
        text,
        level,
      };
    })
    .filter((x): x is HeadingItem => !!x);
}
