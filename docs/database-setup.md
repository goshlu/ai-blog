# 数据库配置说明

本项目支持两种数据库配置方式：本地 SQLite 和 Turso 云数据库。

## 配置逻辑（已修复）

数据库连接由 `src/lib/db.ts` 管理，遵循以下优先级：

1. **如果设置了 `TURSO_DATABASE_URL`（且以 `libsql://` 开头）**
   - 使用 Turso 云数据库
   - 需要同时配置 `TURSO_AUTH_TOKEN`
   - 适用于生产环境

2. **否则使用本地 SQLite**
   - 使用 `DATABASE_URL` 环境变量
   - 如果未设置，默认使用 `file:./prisma/dev.db`
   - 适用于开发环境

**重要：** Prisma 7.x 要求所有数据库连接都使用 adapter。本项目使用 `@prisma/adapter-libsql`，它同时支持本地 SQLite 文件和 Turso 云数据库。

## 验证配置

运行以下命令验证数据库连接：

```bash
# 验证数据库配置和连接
npm run db:verify

# 查看数据库内容（打开 Prisma Studio）
npx prisma studio
```

## 开发环境配置

### 方式 1: 使用本地 SQLite（推荐）

在 `.env.local` 中配置：

```env
DATABASE_URL=file:./prisma/dev.db
```

初始化数据库：

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 方式 2: 使用 Turso（可选）

如果想在开发环境测试 Turso：

```env
TURSO_DATABASE_URL=libsql://your-dev-db.turso.io
TURSO_AUTH_TOKEN=your-dev-token
```

## 生产环境配置

在 Vercel 或其他部署平台的环境变量中设置：

```env
TURSO_DATABASE_URL=libsql://your-prod-db.turso.io
TURSO_AUTH_TOKEN=your-prod-token
```

**注意：** 不要在生产环境设置 `DATABASE_URL`，让系统自动使用 Turso。

## Prisma CLI 配置

Prisma CLI 命令（如 `prisma migrate`、`prisma db push`）使用 `prisma.config.ts` 中的配置：

```typescript
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  },
});
```

这确保了 Prisma CLI 命令始终使用正确的数据库连接。

## 常见问题

### Q: 为什么 Prisma 7 需要 adapter？

A: Prisma 7 改变了架构，所有数据库连接都需要通过 adapter。`@prisma/adapter-libsql` 是一个通用的 SQLite adapter，支持：

- 本地 SQLite 文件（`file:./path/to/db.db`）
- Turso 云数据库（`libsql://your-db.turso.io`）

### Q: 运行时和 Prisma CLI 的配置有什么区别？

A:

- **运行时**（`src/lib/db.ts`）：根据环境变量动态选择数据库
- **Prisma CLI**（`prisma.config.ts`）：用于迁移和 schema 管理

这种分离允许：

- 开发时使用本地 SQLite 进行迁移
- 生产时使用 Turso 云数据库
- 灵活切换而无需修改代码

### Q: 如何在本地测试 Turso 连接？

A: 在 `.env.local` 中设置 `TURSO_DATABASE_URL` 和 `TURSO_AUTH_TOKEN`，系统会自动使用 Turso。

### Q: 数据库迁移如何工作？

A:

```bash
# 开发环境（本地 SQLite）
npx prisma migrate dev --name your_migration_name

# 生产环境（Turso）
# 在 Vercel 部署时自动运行 prisma generate
# 或手动推送 schema
npx prisma db push
```

### Q: 如何在本地和 Turso 之间切换？

A: 只需在 `.env.local` 中注释/取消注释相应的环境变量：

```env
# 使用本地 SQLite
DATABASE_URL=file:./prisma/dev.db

# 使用 Turso（注释掉上面的，启用下面的）
# TURSO_DATABASE_URL=libsql://your-db.turso.io
# TURSO_AUTH_TOKEN=your-token
```

## 验证配置

运行以下命令验证数据库连接：

```bash
# 测试 Prisma 连接
npx prisma db pull

# 查看数据库内容
npx prisma studio
```
