import { notFound } from "next/navigation";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";
import prisma from "@/lib/db";
import { calculateReadingTime } from "@/lib/reading-time";
import { Button } from "@/components/ui/button";
import { TranslateButton } from "@/components/TranslateButton";
import { SmartSummary } from "@/components/SmartSummary";
import { ViewCounter } from "@/components/ViewCounter";
import { TableOfContents } from "@/components/PostBodyWithToc";
import { Comments } from "@/components/Comments";
import { PostBodyMdx } from "@/components/PostBodyMdx";
import { SocialShare } from "@/components/SocialShare";
import { RelatedPosts } from "@/components/RelatedPosts";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: { id: true, slug: true },
  });

  return posts.map((post) => ({ slug: post.slug || post.id }));
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
  excerpt?: string | null;
  content: string;
  tags?: Tag[];
}

function stripMarkdown(content: string) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildShareSummary(post: Post) {
  const base = post.excerpt?.trim() || post.content;
  return stripMarkdown(base).slice(0, 140);
}

function extractTerms(post: Post) {
  const base = `${post.title} ${post.excerpt ?? ""} ${stripMarkdown(post.content).slice(0, 500)}`;
  const englishTerms = base.toLowerCase().match(/[a-z]{3,}/g) ?? [];
  const chineseTerms = base.match(/[\u4e00-\u9fa5]{2,8}/g) ?? [];

  return new Set([...englishTerms, ...chineseTerms].slice(0, 80));
}

function scoreRelatedPost(currentPost: Post, candidate: Post) {
  const currentTags = new Set(
    (currentPost.tags ?? []).map((tag) => tag.name.toLowerCase()),
  );
  const candidateTags = new Set(
    (candidate.tags ?? []).map((tag) => tag.name.toLowerCase()),
  );
  let score = 0;

  currentTags.forEach((tag) => {
    if (candidateTags.has(tag)) {
      score += 6;
    }
  });

  const currentTerms = extractTerms(currentPost);
  const candidateTerms = extractTerms(candidate);
  let overlap = 0;

  currentTerms.forEach((term) => {
    if (candidateTerms.has(term)) {
      overlap += 1;
    }
  });

  score += Math.min(overlap, 8);

  if (candidate.title === currentPost.title) {
    score = -1;
  }

  return score;
}

export default async function PostPage({ params }: Props) {
  const { slug: identifier } = await params;

  let post = (await prisma.post.findUnique({
    where: { id: identifier },
    include: { tags: true },
  })) as Post | null;

  if (!post) {
    post = (await prisma.post.findUnique({
      where: { slug: identifier },
      include: { tags: true },
    })) as Post | null;
  }

  if (!post) {
    notFound();
  }

  const [mdxSource, relatedCandidates] = await Promise.all([
    serialize(post.content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    }),
    prisma.post.findMany({
      where: {
        id: {
          not: post.id,
        },
      },
      include: {
        tags: true,
      },
      take: 24,
      orderBy: {
        updatedAt: "desc",
      },
    }) as Promise<Post[]>,
  ]);

  const readMinutes = calculateReadingTime(post.content);
  const shareSummary = buildShareSummary(post);
  const relatedPosts = relatedCandidates
    .map((candidate) => ({
      ...candidate,
      score: scoreRelatedPost(post, candidate),
    }))
    .filter((candidate) => candidate.score >= 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3)
    .map(({ score: _score, ...candidate }) => candidate);

  return (
    <div className="mt-6 md:mt-10">
      <div className="mb-6 flex items-center justify-between gap-3 text-xs text-zinc-500 md:mb-8">
        <Link href="/" className="inline-flex">
          <Button
            variant="ghost"
            className="-ml-3 h-8 rounded-full border border-transparent px-3 text-[13px] text-zinc-600 hover:border-zinc-200 hover:bg-zinc-100/60 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/70"
          >
            返回首页
          </Button>
        </Link>

        <div className="hidden items-center gap-2 text-[12px] md:flex">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-500 dark:bg-zinc-900/80 dark:text-zinc-400">
            博客 / 文章详情
          </span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_240px] lg:items-start lg:gap-10 xl:gap-12">
        <article className="relative overflow-hidden rounded-[2rem] border border-zinc-100/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.12)] dark:border-zinc-800/80 dark:bg-[#05060a]/90 dark:shadow-[0_18px_80px_rgba(0,0,0,0.65)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50/90 via-white/0 to-transparent dark:from-zinc-900/80 dark:via-transparent" />

          <div className="relative border-b border-zinc-100/80 px-5 pb-6 pt-7 dark:border-zinc-800/80 md:px-10 md:pt-9">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-[12px] font-medium text-zinc-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-300">
                技术 / 博客
              </span>
              <time className="rounded-full bg-zinc-50 px-3 py-1 dark:bg-zinc-900/70">
                发布于 {post.date}
              </time>
              <span className="rounded-full bg-zinc-50 px-3 py-1 dark:bg-zinc-900/70">
                约 {readMinutes} 分钟阅读
              </span>
              <ViewCounter slug={post.slug} />
            </div>

            <h1 className="mb-6 text-balance text-center text-2xl font-extrabold leading-snug tracking-tight text-zinc-950 dark:text-zinc-50 md:text-[2.4rem] md:leading-tight">
              {post.title}
            </h1>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-[12px] font-medium text-pink-600 dark:border-pink-800/50 dark:bg-pink-900/20 dark:text-pink-400"
                  >
                    # {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <section className="relative border-b border-zinc-100/80 bg-zinc-50/60 px-5 pb-2 pt-5 dark:border-zinc-800/80 dark:bg-zinc-950/60 md:px-10 md:pt-7">
            <div className="mx-auto max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1 text-[11px] font-medium text-zinc-50 shadow-sm dark:bg-zinc-50 dark:text-zinc-900">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                关键洞察
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-white/90 px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.12)] dark:border-zinc-800/90 dark:bg-[#05060a]/95 dark:shadow-[0_18px_60px_rgba(0,0,0,0.75)] md:px-6 md:py-5">
                <SmartSummary content={post.content} />
              </div>
            </div>
          </section>

          <section className="relative px-5 py-7 md:px-10 md:py-10">
            <PostBodyMdx source={mdxSource} />
          </section>

          <footer className="relative flex flex-col gap-4 border-t border-zinc-100/80 px-5 py-5 dark:border-zinc-800/80 md:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-[12px] text-zinc-400">
              © {new Date().getFullYear()} 我的博客 / 文章阅读完毕
            </div>
            <div className="flex flex-col items-stretch gap-3 md:items-end">
              <SocialShare
                title={post.title}
                summary={shareSummary}
                path={`/posts/${post.id}`}
              />
              <div className="flex justify-end">
                <TranslateButton content={post.content} />
              </div>
            </div>
          </footer>
        </article>

        <div className="sticky top-24 hidden self-start pt-2 lg:block">
          <TableOfContents content={post.content} />
        </div>
      </div>

      <RelatedPosts posts={relatedPosts} />
      <Comments slug={post.slug} />
    </div>
  );
}
