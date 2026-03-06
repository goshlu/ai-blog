# 安全修复记录 - 2026-03-06

本文档记录了今日完成的安全性改进和问题修复。

## 修复的问题

### 1. 数据库连接配置不一致 ✅

**问题描述：**

- `src/lib/db.ts` 在未配置 Turso 时仍尝试连接远程数据库
- 只检查 `TURSO_DATABASE_URL` 而未验证 `TURSO_AUTH_TOKEN`
- 导致本地开发时数据库连接失败

**修复方案：**

```typescript
// 修改前：只检查 URL
if (tursoUrl && tursoUrl.startsWith("libsql://")) {
  // 尝试连接 Turso
}

// 修改后：同时检查 URL 和 Token
const tursoToken = process.env.TURSO_AUTH_TOKEN;
if (tursoUrl && tursoToken && tursoUrl.startsWith("libsql://")) {
  // 只有两者都配置才连接 Turso
}
```

**影响：**

- 本地开发环境现在正确使用 SQLite
- 生产环境需要同时配置 URL 和 Token 才会使用 Turso
- 避免了连接失败导致的数据库操作错误

**文件：** `src/lib/db.ts`

---

### 2. Admin 路由身份验证问题 ✅

**问题描述：**

- `src/app/admin/layout.tsx` 使用同步方式调用 `cookies()`
- Next.js 15+ 要求 `cookies()` 必须使用 `await`
- 可能导致身份验证失败或运行时错误

**修复方案：**

```typescript
// 修改前：同步调用
export default function AdminLayout({ children }) {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  // ...
}

// 修改后：异步调用
export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  // ...
}
```

**影响：**

- 管理后台路由现在正确验证身份
- 符合 Next.js 15+ 的 API 要求
- 未登录用户无法访问 `/admin/*` 路由

**文件：** `src/app/admin/layout.tsx`

---

### 3. AI API 无使用限制 ✅

**问题描述：**

- `/api/summary` 和 `/api/translate` 端点没有 AI 使用限制
- 虽然有频率限制，但无法防止成本失控
- 可能导致 API 费用无限增长

**修复方案：**

在两个端点中添加了 AI 使用限制检查：

```typescript
// 添加 AI 使用限制
const estimatedInputTokens = estimateTokens(content) + 500;
const usageCheck = checkAiUsageLimit("global:summary", estimatedInputTokens, {
  maxRequests: 100, // 每小时最多 100 次
  maxTokens: 300000, // 每小时最多 30 万 tokens
  maxCost: 3.0, // 每小时最多 $3
});

if (!usageCheck.allowed) {
  return new Response(JSON.stringify({ error: usageCheck.error }), {
    status: 429,
  });
}
```

**限制策略：**

| API 端点             | 每小时请求数 | 每小时 Tokens | 每小时成本 |
| -------------------- | ------------ | ------------- | ---------- |
| `/api/generate-post` | 50 次        | 200,000       | $2.00      |
| `/api/summary`       | 100 次       | 300,000       | $3.00      |
| `/api/translate`     | 50 次        | 500,000       | $5.00      |

**影响：**

- 防止 AI API 成本失控
- 三重限制：请求次数、token 数量、成本
- 超限时返回 429 状态码和友好错误信息

**文件：**

- `src/app/api/summary/route.ts`
- `src/app/api/translate/route.ts`

---

## 代码质量改进

### 移除未使用的导入 ✅

修复了以下文件中的 TypeScript 警告：

- `src/app/api/summary/route.ts` - 移除未使用的 `NextResponse`
- `src/app/api/generate-post/route.ts` - 移除未使用的 `NextResponse`

---

## 文档更新

### 更新安全文档 ✅

在 `docs/security.md` 中添加了：

1. **AI API 使用限制章节**
   - 详细的限制策略表格
   - 实现细节说明
   - 超限响应示例
   - 自定义限制配置方法

2. **已实现功能清单更新**
   - 添加 AI API 使用限制
   - 添加数据库连接配置验证

---

## 测试建议

### 1. 数据库连接测试

```bash
# 测试本地 SQLite 连接
npm run dev
# 访问任何需要数据库的页面，确认正常工作

# 测试 Turso 连接（如果已配置）
# 在 .env.local 中取消注释 Turso 配置
# 重启服务器并测试
```

### 2. 管理员身份验证测试

```bash
# 1. 未登录访问管理后台
curl http://localhost:3000/admin
# 应该重定向到 /login

# 2. 登录后访问
# 在浏览器中登录，然后访问 /admin
# 应该正常显示管理后台
```

### 3. AI API 限制测试

```bash
# 测试摘要生成限制
for i in {1..101}; do
  curl -X POST http://localhost:3000/api/summary \
    -H "Content-Type: application/json" \
    -d '{"content":"测试内容"}' \
    -b "admin_session=YOUR_SESSION_TOKEN"
done
# 第 101 次请求应该返回 429 错误
```

---

## 安全检查清单

部署前请确认：

- [x] 数据库连接配置正确（本地 SQLite 或 Turso）
- [x] 管理员身份验证正常工作
- [x] AI API 使用限制已启用
- [x] 所有 TypeScript 错误已修复
- [x] 安全文档已更新

---

## 后续建议

### 短期（可选）

1. **添加 AI 使用监控**
   - 记录实际的 token 使用量
   - 生成使用报告
   - 设置成本告警

2. **优化限制策略**
   - 根据实际使用情况调整限制
   - 考虑为不同用户设置不同限制
   - 添加限制重置通知

### 长期（可选）

1. **使用 Redis 存储限制数据**
   - 支持多实例部署
   - 更精确的限制控制
   - 持久化使用记录

2. **实现用户级别的限制**
   - 为不同管理员设置不同配额
   - 跟踪每个用户的使用情况
   - 实现配额管理界面

---

## 总结

本次修复解决了三个关键安全问题：

1. ✅ 数据库连接配置不一致 - 现在正确处理本地和远程数据库
2. ✅ Admin 路由身份验证 - 符合 Next.js 15+ 要求
3. ✅ AI API 无使用限制 - 防止成本失控

所有修改都经过测试，TypeScript 类型检查通过，文档已更新。
