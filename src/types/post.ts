export interface Post {
  // 数据库主键，用于 URL 等场景；旧的本地种子数据可能没有 id，因此是可选的
  id?: string;
  // 语义化的 slug，仅用于展示或内部引用
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string; // 逗号分隔的标签
}
