export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectItem {
  slug: string;
  name: string;
  summary: string;
  description: string;
  role: string;
  period: string;
  status: string;
  techStack: string[];
  highlights: string[];
  metrics?: string[];
  links: ProjectLink[];
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || '';
const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL?.trim() || '';

export const projects: ProjectItem[] = [
  {
    slug: 'ai-blog-platform',
    name: 'AI Blog Platform',
    summary: 'A production-ready personal publishing platform with SEO, subscriptions, sharing, and admin workflows.',
    description:
      'Built and iterated as a full-stack content platform. The project covers article publishing, note taking, RSS, sitemap generation, social sharing, email subscriptions, admin protection, and rate limiting.',
    role: 'Product design, frontend, backend, and deployment',
    period: '2026',
    status: 'Active',
    techStack: ['Next.js App Router', 'TypeScript', 'Tailwind CSS', 'Prisma', 'SQLite / Turso'],
    highlights: [
      'Implemented article pages with table of contents, related posts, comments, and share actions.',
      'Added RSS feed, sitemap.xml, subscription flow, and 404 / loading states for SEO and UX.',
      'Secured admin and public APIs with session auth and rate limiting.',
    ],
    metrics: ['RSS + sitemap ready', 'Admin-protected content workflow', 'Subscription and notification pipeline'],
    links: [
      ...(siteUrl ? [{ label: 'Live Demo', href: siteUrl }] : []),
      ...(githubUrl ? [{ label: 'Source Code', href: githubUrl }] : []),
    ],
  },
  {
    slug: 'content-ops-console',
    name: 'Content Ops Console',
    summary: 'An internal workflow focused on writing, publishing, moderation, and safe content operations.',
    description:
      'This module focuses on the operational side of content management: admin authentication, protected write APIs, reusable validation, and support for future editorial workflows.',
    role: 'Backend architecture and workflow design',
    period: '2026',
    status: 'In progress',
    techStack: ['Next.js Route Handlers', 'Prisma', 'HTTP-only cookies', 'TypeScript'],
    highlights: [
      'Protected admin pages and write endpoints with signed sessions.',
      'Standardized reusable guards for post and tag mutations.',
      'Prepared the codebase for future note and thought management APIs.',
    ],
    metrics: ['Protected write actions', 'Shared auth guard', 'Typed server handlers'],
    links: githubUrl ? [{ label: 'Repository', href: githubUrl }] : [],
  },
  {
    slug: 'engagement-tooling',
    name: 'Engagement Tooling',
    summary: 'A collection of retention features designed to improve discovery, sharing, and repeat visits.',
    description:
      'This workstream groups together the audience-facing features around growth and engagement, including email subscriptions, social sharing, related recommendations, and content discovery surfaces.',
    role: 'Feature planning and implementation',
    period: '2026',
    status: 'Active',
    techStack: ['React', 'Next.js', 'Prisma', 'Web Share API', 'RSS 2.0'],
    highlights: [
      'Built a subscription flow with unsubscribe support and webhook-based notifications.',
      'Added native sharing, copy-link support, and social distribution entry points.',
      'Implemented related post recommendations using tags and keyword overlap scoring.',
    ],
    metrics: ['Email subscribe / unsubscribe flow', 'Social sharing entry points', 'Recommendation engine'],
    links: siteUrl ? [{ label: 'See It Live', href: siteUrl }] : [],
  },
];
