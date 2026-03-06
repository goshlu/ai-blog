# AI Blog

An AI-powered blog built with Next.js 15, featuring AI-generated content, MDX support, and Turso database.

![Tests](https://github.com/yourusername/blog-ai/workflows/Tests/badge.svg)

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

## Environment Variables

项目需要以下环境变量。创建 `.env.local` 文件并配置：

### 必需变量

| 变量名           | 描述                                              | 示例                   | 必需 |
| ---------------- | ------------------------------------------------- | ---------------------- | ---- |
| `OPENAI_API_KEY` | OpenAI API 密钥，用于 AI 内容生成、摘要和翻译功能 | `sk-...`               | 是   |
| `ADMIN_PASSWORD` | 管理员登录密码                                    | `your-secure-password` | 是   |

### 数据库配置（二选一）

**选项 1: 本地 SQLite（开发环境）**

| 变量名         | 描述                   | 示例                   | 必需     |
| -------------- | ---------------------- | ---------------------- | -------- |
| `DATABASE_URL` | 本地 SQLite 数据库路径 | `file:./prisma/dev.db` | 开发环境 |

**选项 2: Turso 云数据库（生产环境推荐）**

| 变量名               | 描述                 | 示例                        | 必需     |
| -------------------- | -------------------- | --------------------------- | -------- |
| `TURSO_DATABASE_URL` | Turso 数据库连接 URL | `libsql://your-db.turso.io` | 生产环境 |
| `TURSO_AUTH_TOKEN`   | Turso 认证令牌       | `eyJhbGc...`                | 生产环境 |

### 可选变量

| 变量名                     | 描述                                       | 示例                              | 默认值                                  |
| -------------------------- | ------------------------------------------ | --------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`     | 网站公开 URL，用于 RSS、sitemap 和社交分享 | `https://yourblog.com`            | `https://ai-blog-five-sigma.vercel.app` |
| `ADMIN_SESSION_SECRET`     | 管理员会话加密密钥                         | `random-secret-string`            | 使用 `ADMIN_PASSWORD`                   |
| `SUBSCRIPTION_WEBHOOK_URL` | 订阅通知 Webhook URL（如使用邮件通知功能） | `https://your-webhook.com/notify` | -                                       |

### 示例 .env.local 文件

```env
# OpenAI API（必需）
OPENAI_API_KEY=sk-your-openai-api-key

# 管理员密码（必需）
ADMIN_PASSWORD=your-secure-password

# 本地开发数据库（开发环境）
DATABASE_URL=file:./prisma/dev.db

# 或使用 Turso 云数据库（生产环境）
# TURSO_DATABASE_URL=libsql://your-db.turso.io
# TURSO_AUTH_TOKEN=your-turso-auth-token

# 网站 URL（可选）
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 订阅通知 Webhook（可选）
# SUBSCRIPTION_WEBHOOK_URL=https://your-webhook.com/notify
```

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key (for AI features)
- Turso account (optional, for production database)

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

3. Set up environment variables (see Environment Variables section above):

```bash
# 复制并编辑环境变量文件
cp .env .env.local
```

4. Generate Prisma Client:

```bash
npx prisma generate
```

5. Initialize database:

```bash
# 本地开发环境（使用 SQLite）
npx prisma generate
npx prisma db push

# 或运行迁移
npx prisma migrate dev

# 生产环境（使用 Turso）
# 确保已配置 TURSO_DATABASE_URL 和 TURSO_AUTH_TOKEN
npx prisma generate
npx prisma db push
```

6. (可选) 运行种子数据：

```bash
npx tsx prisma/seed.ts
```

7. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

### Verify Setup

验证数据库配置是否正确：

```bash
npm run db:verify
```

检查安全配置：

```bash
npm run security:check
```

## Testing

项目使用 Vitest 作为测试框架。

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式（开发时使用）
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage

# 使用 UI 界面运行测试
npm run test:ui
```

### 测试覆盖

当前已为以下核心功能添加单元测试：

- `src/lib/reading-time.ts` - 阅读时间计算
- `src/lib/headings.ts` - 标题提取和 slug 生成
- `src/lib/rate-limit.ts` - API 请求频率限制
- `src/lib/posts.ts` - 文章数据管理

测试文件位于 `src/lib/__tests__/` 目录。

### Database Setup Notes

**本地开发：**

- 默认使用 SQLite 数据库（`file:./prisma/dev.db`）
- 无需额外配置，开箱即用
- 数据存储在 `prisma/dev.db` 文件中

**生产部署：**

- 推荐使用 Turso 云数据库
- Turso 提供免费套餐，支持全球边缘部署
- 配置 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN` 后自动切换

**详细配置说明：** 查看 [数据库配置文档](./docs/database-setup.md)

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

| Variable                   | Description                   | Required |
| -------------------------- | ----------------------------- | -------- |
| `OPENAI_API_KEY`           | OpenAI API 密钥，用于 AI 功能 | 是       |
| `ADMIN_PASSWORD`           | 管理员登录密码                | 是       |
| `DATABASE_URL`             | 本地 SQLite 数据库路径        | 开发环境 |
| `TURSO_DATABASE_URL`       | Turso 数据库 URL              | 生产环境 |
| `TURSO_AUTH_TOKEN`         | Turso 认证令牌                | 生产环境 |
| `NEXT_PUBLIC_SITE_URL`     | 网站公开 URL                  | 否       |
| `ADMIN_SESSION_SECRET`     | 会话加密密钥                  | 否       |
| `SUBSCRIPTION_WEBHOOK_URL` | 订阅通知 Webhook              | 否       |

详细配置说明请参考上方的"Environment Variables"章节。

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Environment Variables on Vercel

在 Vercel 项目设置 → Environment Variables 中添加：

**必需变量：**

- `OPENAI_API_KEY`: 你的 OpenAI API 密钥
- `ADMIN_PASSWORD`: 管理员密码
- `TURSO_DATABASE_URL`: `libsql://your-db.turso.io`
- `TURSO_AUTH_TOKEN`: 从 Turso 控制台获取

**可选变量：**

- `NEXT_PUBLIC_SITE_URL`: 你的域名（如 `https://yourblog.com`）
- `SUBSCRIPTION_WEBHOOK_URL`: 订阅通知 Webhook URL（如需邮件通知功能）

## Admin Access

访问 `/login` 使用 `ADMIN_PASSWORD` 登录管理后台。管理后台路径：`/admin`

**安全说明：** 所有管理员路由和 API 都受到身份验证保护。详细信息请查看 [安全性文档](./docs/security.md)。

## Contributing

欢迎贡献！在提交 PR 前，请确保：

1. 所有测试通过：`npm test`
2. 代码通过 lint 检查：`npm run lint`
3. 为新功能添加相应的测试

### 添加测试

测试文件应放在 `src/lib/__tests__/` 目录下，文件名格式为 `*.test.ts`。

示例：

```typescript
import { describe, it, expect } from "vitest";
import { yourFunction } from "../your-module";

describe("yourFunction", () => {
  it("应该正确处理输入", () => {
    expect(yourFunction("input")).toBe("expected");
  });
});
```

## License

MIT
