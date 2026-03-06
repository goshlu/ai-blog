import Link from 'next/link';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { calculateReadingTime, formatReadingTime } from '@/lib/reading-time';

interface Tag {
  name: string;
}

interface BlogCardProps {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    imageUrl?: string;
    tags?: Tag[];
    content?: string;
}

export function BlogCard({ title, excerpt, date, slug, imageUrl, tags, content }: BlogCardProps) {
    const readingTime = content ? calculateReadingTime(content) : 1;
    return (
        <Link href={`/posts/${slug}`} className="group block outline-none">
            <article className="relative flex flex-col md:flex-row w-full bg-white dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-100/80 dark:border-zinc-800/50 p-2 md:p-3 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(236,72,153,0.15)] transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden">

                {/* 左侧：精美收敛的内部图片区域 */}
                <div className="relative w-full md:w-[32%] aspect-[16/10] md:aspect-auto rounded-3xl overflow-hidden shrink-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{
                            backgroundImage: `url('${imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop&q=80'}')`
                        }}
                    />
                    {/* 渐变叠加层 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/10 transition-all duration-500" />
                    {/* 悬停时的发光效果 */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-pink-500/10 to-purple-500/10" />
                </div>

                {/* 右侧：极简排版文本区 */}
                <div className="flex flex-col flex-1 pt-4 pb-3 md:py-6 px-3 md:px-8 justify-center bg-transparent relative z-10">

                    <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800/60 dark:to-zinc-800/30 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/30 whitespace-nowrap shrink-0">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {date}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800/60 dark:to-zinc-800/30 text-[13px] font-medium text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/30 whitespace-nowrap shrink-0">
                            <ClockIcon className="w-3.5 h-3.5" />
                            {formatReadingTime(readingTime)}
                        </span>
                        {tags && tags.map((tag) => (
                            <span 
                                key={tag.name}
                                className="inline-flex items-center px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-900/20 text-[12px] font-medium text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-800/50 whitespace-nowrap shrink-0"
                            >
                                # {tag.name}
                            </span>
                        ))}
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-pink-500 dark:group-hover:text-pink-400">
                        {title}
                    </h3>

                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 md:line-clamp-3 mb-0 text-sm md:text-[15px] font-light">
                        {excerpt}
                    </p>

                    {/* 阅读更多指示器 */}
                    <div className="mt-4 flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
                        <span>阅读全文</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>

                </div>
            </article>
        </Link>
    );
}
