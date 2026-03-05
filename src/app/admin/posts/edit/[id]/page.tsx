import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { PostEditor } from '@/components/PostEditor';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id: identifier } = await params;

  // 允许既通过 id 也通过 slug 打开编辑页（兼容旧链接）
  let post = await prisma.post.findUnique({ where: { id: identifier } });

  if (!post) {
    post = await prisma.post.findUnique({ where: { slug: identifier } });
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          编辑文章
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          更新文章内容或标题（Slug 暂不支持在此修改）
        </p>
      </header>

      <PostEditor
        post={{
          slug: post.slug,
          title: post.title,
          date: post.date,
          excerpt: post.excerpt || '',
          content: post.content,
        }}
      />
    </div>
  );
}

