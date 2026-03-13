export interface StaticPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string;
}

export const posts: StaticPost[] = [
  {
    slug: 'building-this-blog',
    title: 'From Portfolio Shell to Production Blog',
    date: '2026-03-01',
    excerpt: 'A more personal write-up of what I actually had to build to turn a polished personal site into something I could keep publishing on.',
    content: `# From Portfolio Shell to Production Blog

A personal site can look complete long before it is actually useful.

That was the state of this project for a while. The homepage looked right. The visual system was mostly in place. But the product underneath was still too fragile. It depended on placeholders, perfect local state, and too much manual glue.

I have learned that this is where many personal projects quietly stop. They become good screenshots, not durable software.

## What felt unfinished to me

The real problem was not styling. It was that the site still lacked the invisible systems that make writing cheap and maintenance realistic.

At that point I was still missing pieces like:

- stable content paths
- feed and sitemap support
- resilient empty states
- stronger detail pages
- cleaner ways to move from reading to contact

None of these are glamorous. All of them matter.

## The shift in mindset

The project improved once I stopped treating it like a homepage and started treating it like a product.

That changed the way I prioritized work. I became less interested in decorative polish and more interested in operational confidence.

The question stopped being: does this page look finished?

It became: can I keep using this system a month from now without fighting it?

## What I actually built

I added the parts that make a content system feel real:

- RSS and sitemap output
- loading and not-found states
- article table of contents
- related post logic
- share actions
- subscription flow
- fallback content when the database is empty

This is the kind of work that rarely gets highlighted, but it changes the product more than another gradient ever will.

## Why fallback content mattered

One thing I care about a lot is demo stability.

If a project only looks right when the database is perfectly prepared, it is too easy to break during development, reviews, or local setup. That is why I added static fallback content on top of the database-backed model.

I wanted the site to remain presentable even when the environment was imperfect.

That decision made the whole product feel more forgiving.

## A more honest version of the stack

The stack is not trying to be clever. It is trying to stay useful:

- Next.js App Router
- TypeScript
- Prisma
- SQLite or Turso
- Tailwind CSS

I like this combination because it stays small while still supporting real publishing workflows.

## What changed after that

Once the infrastructure was in place, the site started feeling less like a template and more like something I could actually grow.

That is an important point for me: I do not want a portfolio that only performs identity. I want one that can keep absorbing work, writing, and iteration without collapsing under its own setup.

## What I still want to improve

Now that the shell is finally solid, the bottleneck is content quality.

The next step is not another redesign. It is better writing, more original case studies, and more material that sounds like me instead of sounding like filler.

That is the stage I am in now. The system is finally good enough that the content deserves more attention.
`,
    tags: 'Next.js,Architecture,Product Engineering',
  },
  {
    slug: 'admin-auth-and-rate-limits',
    title: 'Locking Down the Admin Without Overbuilding Auth',
    date: '2026-02-18',
    excerpt: 'A more direct account of how I secured the admin and public mutation paths without turning a small content site into an auth-heavy system.',
    content: `# Locking Down the Admin Without Overbuilding Auth

I usually do not like adding security layers just for the feeling of being thorough.

On small products, that kind of thinking can create more ceremony than actual protection. But leaving a content admin open is worse. Once a site has write paths, subscriptions, and admin routes, the threat model changes whether the project feels big or not.

This project reached that point.

## What was wrong

The problems were simple and serious in the usual way:

- admin pages were too open
- write endpoints were too easy to call directly
- login had no meaningful brute-force friction
- public forms had no rate limiting

There was no dramatic exploit here. Just the standard collection of ways a small site gets abused once it is public.

## What I did not want

I did not want to pull in a large auth platform or redesign the whole app around identity.

That would have been the wrong tradeoff for a personal content system.

I wanted something smaller:

- enough structure to close the obvious holes
- enough reuse to avoid inconsistent checks
- low enough complexity that I would still understand it later

## The shape of the solution

I added a lightweight admin session model based on signed cookies.

That gave me a few important things immediately:

- a login route
- a logout route
- session verification on the server
- reusable guards for protected APIs
- server-side protection for admin pages

The value here is not novelty. It is alignment.

If the page layer says a route is protected but the API layer stays open, the protection is not real. I wanted both layers to agree.

## Read should stay easy, write should not

I kept reads public because this is still a blog.

Posts, notes, feeds, and site metadata should remain easy to consume. The place where friction belongs is mutation.

So I applied auth checks to the write paths and left the public reading surface simple.

That separation feels right for this kind of product.

## Why rate limiting matters even on a small site

Rate limiting is one of those features that feels optional right up until it does not.

I added it around the places most likely to attract abuse:

- admin login
- subscription endpoints
- unsubscribe endpoints
- post writes
- tag creation

Right now it is implemented in memory, which is acceptable for local work and a single-instance deployment.

If the project grows into multiple instances, I would move that logic into shared storage. But I do not think every small site needs to start there.

## The lesson I keep relearning

Security work on small products is rarely about advanced techniques. It is about reducing the easiest failure modes.

That usually means:

- explicit admin checks
- fewer assumptions about trust
- protected mutation paths
- signed sessions
- basic abuse controls

That baseline already changes the risk profile a lot.

## What I like about this version

It is small enough that I still trust myself to maintain it.

That matters. A security layer that nobody wants to touch becomes its own problem. I would rather have a compact, readable baseline than a heavy system that is only partially understood.

## What comes next

If I keep expanding the admin, the next things worth adding are clear:

- shared rate-limit storage
- audit logging
- stronger password rotation guidance
- moderation paths for public input

For now, I am satisfied that the product moved from casually exposed to responsibly protected.
`,
    tags: 'Security,Next.js,Backend',
  },
  {
    slug: 'static-fallbacks-and-seeding',
    title: 'Why I Kept Static Fallback Content in a Database-Backed Blog',
    date: '2026-01-30',
    excerpt: 'A more personal explanation of why I still keep typed starter content around even though the app already has Prisma models and a real database.',
    content: `# Why I Kept Static Fallback Content in a Database-Backed Blog

At first, static fallback content sounds like the kind of thing that should disappear once a project has a real database.

That was my assumption too. If Prisma already owns the content model, why keep another source around at all?

The short answer is that database-backed apps can still feel brittle during development.

## The problem I wanted to solve

An empty local database does not usually break the app in a dramatic way. It does something more annoying than that.

It makes the product look unfinished.

The homepage feels hollow. List pages lose meaning. Detail pages become harder to exercise. Demo environments drift from development environments.

Technically, the app is still running. Practically, it feels weak.

## What fallback content gives me

The fallback layer is not there to replace the database. It is there to protect the default experience.

I use a simple rule:

- the database is the primary source
- static starter content is the safety net
- APIs prefer database results
- pages still render useful content when the database is empty

That makes the product easier to clone, easier to demo, and easier to iterate on without constant setup repair.

## Why this mattered more than I expected

The value is mostly about momentum.

When I can open the project in a fresh environment and still get a meaningful UI, I move faster. When a route still has real content after a reset, I make better layout decisions. When the app looks stable during demos, I trust it more.

These are small advantages individually. Together they reduce a surprising amount of drag.

## The real risk: drift

The downside of fallback content is not complexity. It is divergence.

If starter content and seeded database content stop matching, the product becomes harder to reason about. That is why I made sure the seed script imports the same content source and why I corrected the database path mismatch between seeding and runtime.

That alignment is what makes the pattern sustainable.

## I prefer boring implementations here

The implementation is intentionally simple:

- typed starter content in src/lib
- API handlers that fall back when Prisma returns nothing
- detail pages that can render from either source
- seed scripts that reuse the same content arrays

That is not elegant in a flashy way. It is useful in a debugging way.

## What I took away from this

I keep coming back to the same idea: good defaults are a real product feature.

Most people will never notice fallback content directly. They will only notice that the site still feels stable when the environment is not perfect.

That is exactly the kind of engineering work I value more over time.
`,
    tags: 'Prisma,DX,Content Systems',
  },
];

export function getAllPosts(): StaticPost[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): StaticPost | undefined {
  return posts.find((post) => post.slug === slug);
}
