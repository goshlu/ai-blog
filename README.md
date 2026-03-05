# AI Blog

An AI-powered blog built with Next.js 15, featuring AI-generated content, MDX support, and Turso database.

## Features

- 🤖 **AI Content Generation** - Generate blog post content using AI
- 📝 **Markdown/MDX Support** - Write posts in Markdown with MDX components
- 🏷️ **Tags & Categories** - Organize posts with tags
- 💬 **Comments System** - Reader comments on posts
- 📊 **View Counter** - Track post views
- 🌙 **Dark Mode** - Automatic dark mode support
- 📱 **Responsive Design** - Works on all devices
- 🔐 **Admin Panel** - Protected admin area for managing posts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Turso (libsql)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT
- **Content**: MDX with next-mdx-remote

## Getting Started

### Prerequisites

- Node.js 18+
- Turso account (for database)
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd blog-ai
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:

```env
# Turso Database
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"

# OpenAI
OPENAI_API_KEY="sk-your-openai-key"

# NextAuth (optional)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

5. Push schema to database:

```bash
npx prisma db push
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── posts/             # Blog posts
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components
│   └── mdx/              # MDX components
├── lib/                   # Utility functions
│   ├── db.ts             # Prisma client
│   ├── posts.ts          # Post utilities
│   └── ai.ts             # AI utilities
└── types/                 # TypeScript types
```

## Environment Variables

| Variable             | Description                    | Required |
| -------------------- | ------------------------------ | -------- |
| `TURSO_DATABASE_URL` | Turso database URL             | Yes      |
| `TURSO_AUTH_TOKEN`   | Turso authentication token     | Yes      |
| `OPENAI_API_KEY`     | OpenAI API key for AI features | Yes      |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables on Vercel

Add these in Vercel Project Settings → Environment Variables:

- `TURSO_DATABASE_URL`: `libsql://ai-blog-db-goshlu.aws-ap-northeast-1.turso.io`
- `TURSO_AUTH_TOKEN`: (your token from Turso dashboard)
- `OPENAI_API_KEY`: (your OpenAI API key)

## License

MIT
