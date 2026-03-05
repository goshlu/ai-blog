import Link from 'next/link';
import prisma from '@/lib/db';

// 管理后台需要实时看到最新文章，这里强制使用动态渲染
export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { date: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            文章管理
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            共 {posts.length} 篇文章
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-500/25"
        >
          + 新建文章
        </Link>
      </header>

      <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                发布日期
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {posts.map((post) => {
              const identifier = post.id ?? post.slug;
              return (
              <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {post.title}
                    </div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      /posts/{identifier}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                  {post.date}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/posts/${identifier}`}
                      className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                      查看
                    </Link>
                    <Link
                      href={`/admin/posts/edit/${identifier}`}
                      className="text-xs text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      编辑
                    </Link>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <Link
          href="/admin"
          className="text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          ← 返回管理首页
        </Link>
      </div>
    </div>
  );
}
