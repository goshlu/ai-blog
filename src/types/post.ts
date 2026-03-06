// 重新导出 Prisma 生成的类型，保持向后兼容
export type { Post, Tag } from "@prisma/client";

// 带标签的 Post 类型
export type PostWithTags = Post & {
  tags: Tag[];
};
