import { Post } from '@/types/post';

export const posts: Post[] = [
  {
    slug: 'hello-world',
    title: '你好，世界',
    date: '2024-01-01',
    excerpt: '这是我的第一篇博客文章，记录学习 Next.js 的心得。',
    content: `# 你好，世界

欢迎来到我的博客！

## 关于本文

这是使用 Next.js 14 和 Tailwind CSS 构建的博客系统。

### 技术栈

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Markdown

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

希望你喜欢这个博客！
`,
  },
  {
    slug: 'nextjs-guide',
    title: 'Next.js 14 完全指南',
    date: '2024-01-15',
    excerpt: '深入探索 Next.js 14 的新特性和最佳实践。',
    content: `# Next.js 14 完全指南

## App Router

Next.js 14 引入了全新的 App Router，带来许多强大的功能。

### 服务器组件

默认情况下，所有组件都是服务器组件，这带来了更好的性能和更小的客户端 bundle。

### 服务器动作

使用 \`use server\` 可以轻松创建服务器端函数。

## 总结

Next.js 14 是一个强大的全栈框架，值得深入学习。
`,
  },
  {
    slug: 'tailwind-tips',
    title: 'Tailwind CSS 实用技巧',
    date: '2024-02-01',
    excerpt: '分享一些 Tailwind CSS 的使用技巧和最佳实践。',
    content: `# Tailwind CSS 实用技巧

## 1. 使用 @apply 复用样式

在 CSS 文件中可以这样使用：

\`\`\`css
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded;
}
\`\`\`

## 2. 自定义主题

在 \`tailwind.config.ts\` 中可以轻松定制主题颜色。

## 3. 响应式设计

使用 \`md:\`, \`lg:\` 等前缀轻松实现响应式布局。

Happy coding! 🚀
`,
  },
];

export function getAllPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
