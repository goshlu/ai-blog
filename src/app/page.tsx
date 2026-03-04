import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { BlogCard } from '@/components/BlogCard';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-16 md:mb-24 mt-8 md:mt-12 px-2">
        <h1 className="text-[2.5rem] md:text-6xl font-extrabold tracking-tight mb-6 text-zinc-800 dark:text-zinc-100">
          Hi, 欢迎来到我的宇宙 👋
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
          我是 YSKM，这里是我的数字花园。<br className="hidden md:block" /> 分享技术探索、生活日常，以及偶尔掉落的奇思妙想。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:gap-10">
        {posts.map((post) => (
          <BlogCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
          />
        ))}
      </div>
    </div>
  );
}
