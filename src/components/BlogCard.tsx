import Link from 'next/link';
import { CalendarIcon } from 'lucide-react';

interface BlogCardProps {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    imageUrl?: string;
}

export function BlogCard({ title, excerpt, date, slug, imageUrl }: BlogCardProps) {
    return (
        <Link href={`/posts/${slug}`} className="group block outline-none">
            <article className="relative flex flex-col md:flex-row w-full bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/80 p-2 md:p-3 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 ease-out hover:-translate-y-1.5 overflow-hidden">

                {/* 左侧：精美收敛的内部图片区域 */}
                <div className="relative w-full md:w-[32%] aspect-[16/10] md:aspect-auto rounded-3xl overflow-hidden shrink-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{
                            backgroundImage: `url('${imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop&q=80'}')`
                        }}
                    />
                    {/* 非常微弱的内部阴影或暗角，用于增加照片质感 */}
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* 右侧：极简排版文本区 */}
                <div className="flex flex-col flex-1 pt-4 pb-3 md:py-6 px-3 md:px-8 justify-center bg-transparent relative z-10">

                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/60 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            {date}
                        </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                        {title}
                    </h3>

                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 md:line-clamp-3 mb-0 text-sm md:text-[15px] font-light">
                        {excerpt}
                    </p>

                </div>
            </article>
        </Link>
    );
}
