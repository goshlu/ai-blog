import { notFound } from "next/navigation";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { serialize } from "next-mdx-remote/serialize";
import type { Prisma } from "@prisma/client";
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
import { getAllPosts, getPostBySlug } from '@/lib/posts';

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

type PostWithTags = Prisma.PostGetPayload<{
  include: { tags: true };
}>;

type DisplayPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string | null;
  content: string;
  tags: Array<{ id: string; name: string }>;
};

export async function generateStaticParams() {
  const dbPosts = await prisma.post.findMany({
    select: { id: true, slug: true },
  });

  const staticPosts = getAllPosts().map((post) => ({ slug: post.slug }));
  const dbParams = dbPosts.map((post) => ({ slug: post.slug || post.id }));

  return [...dbParams, ...staticPosts].filter(
    (value, index, array) => array.findIndex((item) => item.slug === value.slug) === index,
  );
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

function buildShareSummary(post: DisplayPost) {
  const base = post.excerpt?.trim() || post.content;
  return stripMarkdown(base).slice(0, 140);
}

function extractTerms(post: DisplayPost) {
  const base = `${post.title} ${post.excerpt ?? ""} ${stripMarkdown(post.content).slice(0, 500)}`;
  const englishTerms = base.toLowerCase().match(/[a-z]{3,}/g) ?? [];
  const chineseTerms = base.match(/[\u4e00-\u9fa5]{2,8}/g) ?? [];

  return new Set([...englishTerms, ...chineseTerms].slice(0, 80));
}

function scoreRelatedPost(currentPost: DisplayPost, candidate: DisplayPost) {
  const currentTags = new Set(currentPost.tags.map((tag) => tag.name.toLowerCase()));
  const candidateTags = new Set(candidate.tags.map((tag) => tag.name.toLowerCase()));
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

function toDisplayPost(post: PostWithTags): DisplayPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags.map((tag) => ({ id: tag.id, name: tag.name })),
  };
}

function toStaticDisplayPost(post: ReturnType<typeof getPostBySlug> extends infer T ? Exclude<T, undefined> : never): DisplayPost {
  return {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    content: post.content,
    tags: post.tags.split(',').map((tag) => ({ id: tag.trim().toLowerCase(), name: tag.trim() })),
  };
}

export default async function PostPage({ params }: Props) {
  const { slug: identifier } = await params;

  const dbPost =
    (await prisma.post.findUnique({
      where: { id: identifier },
      include: { tags: true },
    })) ||
    (await prisma.post.findUnique({
      where: { slug: identifier },
      include: { tags: true },
    }));

  const staticPost = dbPost ? null : getPostBySlug(identifier);

  if (!dbPost && !staticPost) {
    notFound();
  }

  const currentPost = dbPost ? toDisplayPost(dbPost) : toStaticDisplayPost(staticPost!);

  const [mdxSource, dbRelatedCandidates] = await Promise.all([
    serialize(currentPost.content, {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    }),
    dbPost
      ? prisma.post.findMany({
          where: {
            id: {
              not: dbPost.id,
            },
          },
          include: {
            tags: true,
          },
          take: 24,
          orderBy: {
            updatedAt: "desc",
          },
        })
      : Promise.resolve([] as PostWithTags[]),
  ]);

  const relatedPosts = dbPost
    ? dbRelatedCandidates
        .map((candidate) => toDisplayPost(candidate))
        .map((candidate) => ({
          ...candidate,
          score: scoreRelatedPost(currentPost, candidate),
        }))
        .filter((candidate) => candidate.score >= 0)
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        .slice(0, 3)
        .map(({ score, ...candidate }) => candidate)
    : getAllPosts()
        .filter((candidate) => candidate.slug !== currentPost.slug)
        .map((candidate) => toStaticDisplayPost(candidate))
        .map((candidate) => ({
          ...candidate,
          score: scoreRelatedPost(currentPost, candidate),
        }))
        .filter((candidate) => candidate.score >= 0)
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
        .slice(0, 3)
        .map(({ score, ...candidate }) => candidate);

  const readMinutes = calculateReadingTime(currentPost.content);
  const shareSummary = buildShareSummary(currentPost);
  const postPath = `/posts/${currentPost.slug || currentPost.id}`;

  return (
    <div className="mt-6 md:mt-10">
      <div className="mb-6 flex items-center justify-between gap-3 text-xs text-zinc-500 md:mb-8">
        <Link href="/" className="inline-flex">
          <Button
            variant="ghost"
            className="-ml-3 h-8 rounded-full border border-transparent px-3 text-[13px] text-zinc-600 hover:border-zinc-200 hover:bg-zinc-100/60 dark:text-zinc-400 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/70"
          >
            Back Home
          </Button>
        </Link>

        <div className="hidden items-center gap-2 text-[12px] md:flex">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-500 dark:bg-zinc-900/80 dark:text-zinc-400">
            Blog / Post Details
          </span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.5fr)_240px] lg:items-start lg:gap-10 xl:gap-12">
        <article className="relative overflow-hidden rounded-[2rem] border border-zinc-100/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.12)] dark:border-zinc-800/80 dark:bg-[#05060a]/90 dark:shadow-[0_18px_80px_rgba(0,0,0,0.65)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50/90 via-white/0 to-transparent dark:from-zinc-900/80 dark:via-transparent" />

          <div className="relative border-b border-zinc-100/80 px-5 pb-6 pt-7 dark:border-zinc-800/80 md:px-10 md:pt-9">
            <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-[12px] font-medium text-zinc-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-zinc-600 dark:bg-zinc-900/80 dark:text-zinc-300">
                Tech / Blog
              </span>
              <time className="rounded-full bg-zinc-50 px-3 py-1 dark:bg-zinc-900/70">
                Published on {currentPost.date}
              </time>
              <span className="rounded-full bg-zinc-50 px-3 py-1 dark:bg-zinc-900/70">
                {readMinutes} min read
              </span>
              <ViewCounter slug={currentPost.slug} />
            </div>

            <h1 className="mb-6 text-balance text-center text-2xl font-extrabold leading-snug tracking-tight text-zinc-950 dark:text-zinc-50 md:text-[2.4rem] md:leading-tight">
              {currentPost.title}
            </h1>

            {currentPost.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {currentPost.tags.map((tag) => (
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
                Key Insights
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-white/90 px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.12)] dark:border-zinc-800/90 dark:bg-[#05060a]/95 dark:shadow-[0_18px_60px_rgba(0,0,0,0.75)] md:px-6 md:py-5">
                <SmartSummary content={currentPost.content} />
              </div>
            </div>
          </section>

          <section className="relative px-5 py-7 md:px-10 md:py-10">
            <PostBodyMdx source={mdxSource} />
          </section>

          <footer className="relative flex flex-col gap-4 border-t border-zinc-100/80 px-5 py-5 dark:border-zinc-800/80 md:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-[12px] text-zinc-400">
              © {new Date().getFullYear()} My Blog / End of article
            </div>
            <div className="flex flex-col items-stretch gap-3 md:items-end">
              <SocialShare
                title={currentPost.title}
                summary={shareSummary}
                path={postPath}
              />
              <div className="flex justify-end">
                <TranslateButton content={currentPost.content} />
              </div>
            </div>
          </footer>
        </article>

        <div className="sticky top-24 hidden self-start pt-2 lg:block">
          <TableOfContents content={currentPost.content} />
        </div>
      </div>

      <RelatedPosts posts={relatedPosts} />
      <Comments slug={currentPost.slug} />
    </div>
  );
}
