import { PostEditor } from '@/components/PostEditor';

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          新建文章
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          使用 Markdown 格式编写文章内容
        </p>
      </header>

      <PostEditor />
    </div>
  );
}
