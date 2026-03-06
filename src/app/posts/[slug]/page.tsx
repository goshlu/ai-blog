import { notFound } from 'next/navigation';
import Link from 'next/link';
import remarkGfm from 'remark-gfm';
import { serialize } from 'next-mdx-remote/serialize';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';
import { TranslateButton } from '@/components/TranslateButton';
import { SmartSummary } from '@/components/SmartSummary';
import { ViewCounter } from '@/components/ViewCounter';
import { TableOfContents } from '@/components/PostBodyWithToc';
import { Comments } from '@/components/Comments';
import { PostBodyMdx } from '@/components/PostBodyMdx';

// 强制该路由使用动态渲染，避免基于构建时数据的 404 缓存
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { id: true, slug: true },
  });
  // 生成时优先使用 id 作为路径参数，避免中文 slug 带来的转义问题
  return posts.map((post) => ({ slug: post.id }));
}

interface Tag {
  id: string;
  name: string;
}

interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  tags?: Tag[];
}

export default async function PostPage({ params }: Props) {
  const { slug: identifier } = await params;

  // 1. 优先按 id 查询（新链接：/posts/:id）
  let post = await prisma.post.findUnique({ 
    where: { id: identifier },
    include: { tags: true }
  }) as (Post | null);

  // 2. 如果按 id 没找到，再按 slug 查询，兼容旧链接（/posts/:slug）
  if (!post) {
    post = await prisma.post.findUnique({ 
      where: { slug: identifier },
      include: { tags: true }
    }) as (Post | null);
  }

  if (!post) {
    notFound();
  }

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(wordCount / 220));

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  });

  return (
    <div className="mt-6 md:mt-10">
      {/* 顶部返回 + 面包屑条，模仿参考站点的细条导航 */}
      <div className="mb-6 md:mb-8 flex items-center justify-between gap-3 text-xs text-zinc-500">
        <Link href="/" className="inline-flex">
          <Button
            variant="ghost"
            className="h-8 px-3 -ml-3 rounded-full border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/70 text-[13px] text-zinc-600 dark:text-zinc-400"
          >
            ← 返回首页
          </Button>
        </Link>

        <div className="hidden md:flex items-center gap-2 text-[12px]">
          <span className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400">
            博客 · 文章详情
          </span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_240px] lg:items-start lg:gap-10 xl:gap-12">
        <article className="relative overflow-hidden rounded-[2rem] border border-zinc-100/80 dark:border-zinc-800/80 bg-white/90 dark:bg-[#05060a]/90 shadow-[0_18px_60px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_80px_rgba(0,0,0,0.65)]">
          {/* 顶部轻微渐变背景，类似卡片头部氛围 */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50/90 via-white/0 to-transparent dark:from-zinc-900/80 dark:via-transparent" />

          <div className="relative px-5 md:px-10 pt-7 md:pt-9 pb-6 border-b border-zinc-100/80 dark:border-zinc-800/80">
            <div className="flex flex-wrap items-center justify-center gap-3 text-[12px] text-zinc-500 font-medium mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300">
                技术 · 博客
              </span>
              <time className="px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900/70">
                发布于 {post.date}
              </time>
              <span className="px-3 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900/70">
                约 {readMinutes} 分钟阅读
              </span>
              <ViewCounter slug={post.slug} />
            </div>

            <h1 className="text-2xl md:text-[2.4rem] leading-snug md:leading-tight font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 text-center text-balance mb-6">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/20 text-[12px] font-medium text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-800/50"
                  >
                    # {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 智能摘要区域：模仿参考站的“关键洞察”卡片 */}
          <section className="relative px-5 md:px-10 pt-5 md:pt-7 pb-2 border-b border-zinc-100/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/60">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-zinc-50 px-3 py-1 text-[11px] font-medium mb-3 shadow-sm dark:bg-zinc-50 dark:text-zinc-900">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                关键洞察
              </div>
              <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/90 bg-white/90 dark:bg-[#05060a]/95 px-4 md:px-6 py-4 md:py-5 shadow-[0_10px_35px_rgba(15,23,42,0.12)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.75)]">
                <SmartSummary content={post.content} />
              </div>
            </div>
          </section>

          {/* 正文内容区域（MDX，可在 Markdown 中直接写 React 组件） */}
          <section className="relative px-5 md:px-10 py-7 md:py-10">
            <PostBodyMdx source={mdxSource} />
          </section>

          {/* 底部工具条：翻译按钮等 */}
          <footer className="relative border-t border-zinc-100/80 dark:border-zinc-800/80 px-5 md:px-10 py-5 flex items-center justify-between gap-4">
            <div className="text-[12px] text-zinc-400">
              © {new Date().getFullYear()} 我的博客 · 文章阅读完毕
            </div>
            <div className="flex justify-end">
              <TranslateButton content={post.content} />
            </div>
          </footer>
        </article>

        {/* 右侧全局目录区域（卡片外的固定位置） */}
        <div className="hidden lg:block pt-2 sticky top-24 self-start">
          <TableOfContents content={post.content} />
        </div>
      </div>

      {/* 评论区 */}
      <Comments slug={post.slug} />
    </div>
  );
}
