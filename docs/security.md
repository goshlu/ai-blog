# 安全性说明

本文档说明项目的安全措施和最佳实践。

## 管理员身份验证

### 认证机制

项目使用基于 Cookie 的会话认证系统：

1. **密码验证** - 使用 `ADMIN_PASSWORD` 环境变量
2. **Session Token** - HMAC-SHA256 签名的时间戳令牌
3. **时间安全比较** - 使用 `timingSafeEqual` 防止时序攻击
4. **12 小时过期** - Session 自动过期，需要重新登录

### 受保护的路由

#### 页面路由（通过 Layout 保护）

- `/admin/*` - 所有管理后台页面
  - 在 `src/app/admin/layout.tsx` 中验证
  - 未登录自动重定向到 `/login`

#### API 路由（需要管理员权限）

以下 API 端点需要有效的管理员 session：

- `POST /api/posts` - 创建文章
- `PUT /api/posts` - 更新文章
- `DELETE /api/posts` - 删除文章
- `POST /api/tags` - 创建标签
- `POST /api/generate-post` - AI 生成文章内容
- `POST /api/summary` - 生成文章摘要
- `POST /api/translate` - 翻译文章

#### Server Actions（需要管理员权限）

- `generateSummaryAction` - 生成摘要（在 `src/app/admin/actions.ts`）

### 公开 API 路由

以下端点不需要认证（但有频率限制）：

- `GET /api/posts` - 获取文章列表
- `GET /api/posts/[slug]` - 获取单篇文章
- `GET /api/tags` - 获取标签列表
- `POST /api/subscriptions` - 订阅邮件通知
- `POST /api/subscriptions/unsubscribe` - 取消订阅
- `GET /api/notes` - 获取手记
- `GET /api/thoughts` - 获取思考

## 频率限制

所有 API 端点都实现了频率限制，防止滥用：

### 限制策略

| 端点                  | 时间窗口 | 最大请求数 |
| --------------------- | -------- | ---------- |
| `/api/admin/login`    | 10 分钟  | 20 次      |
| `/api/posts` (POST)   | 1 分钟   | 20 次      |
| `/api/posts` (PUT)    | 1 分钟   | 30 次      |
| `/api/posts` (DELETE) | 1 分钟   | 20 次      |
| `/api/tags` (POST)    | 1 分钟   | 30 次      |
| `/api/generate-post`  | 1 分钟   | 10 次      |
| `/api/summary`        | 1 分钟   | 20 次      |
| `/api/translate`      | 1 分钟   | 10 次      |
| `/api/subscriptions`  | 1 分钟   | 5 次       |

### 实现细节

- 基于 IP 地址的限制
- 内存存储（适合单实例部署）
- 自动清理过期记录
- 返回 `429 Too Many Requests` 和 `Retry-After` 头

## AI API 使用限制

为防止 AI API 成本失控，实现了多层限制机制：

### 限制策略

| API 端点             | 每小时请求数 | 每小时 Tokens | 每小时成本 |
| -------------------- | ------------ | ------------- | ---------- |
| `/api/generate-post` | 50 次        | 200,000       | $2.00      |
| `/api/summary`       | 100 次       | 300,000       | $3.00      |
| `/api/translate`     | 50 次        | 500,000       | $5.00      |

### 实现细节

- **Token 估算** - 根据输入文本长度估算 token 使用量
- **成本计算** - 基于 DeepSeek 定价（$0.14/1M input, $0.28/1M output）
- **三重限制** - 同时检查请求次数、token 数量和成本
- **全局限制** - 所有用户共享限制，防止整体成本失控
- **自动重置** - 每小时自动重置计数器

### 超限响应

当达到限制时，API 返回：

```json
{
  "error": "已达到请求次数限制（50 次/小时）",
  "status": 429
}
```

### 自定义限制

可以在代码中调整限制参数：

```typescript
checkAiUsageLimit("global:summary", estimatedTokens, {
  maxRequests: 100,
  maxTokens: 300000,
  maxCost: 3.0,
  windowMs: 60 * 60 * 1000, // 1 小时
});
```

## 环境变量安全

### 必需的安全配置

```env
# 管理员密码（必需）
ADMIN_PASSWORD=your-secure-password

# Session 加密密钥（可选，默认使用 ADMIN_PASSWORD）
ADMIN_SESSION_SECRET=your-random-secret-string
```

### 最佳实践

1. **使用强密码** - 至少 12 个字符，包含大小写字母、数字和特殊字符
2. **不要提交到版本控制** - `.env.local` 已在 `.gitignore` 中
3. **生产环境单独配置** - 在 Vercel 等平台的环境变量中设置
4. **定期更换密码** - 建议每 3-6 个月更换一次

## Cookie 安全

Session cookie 配置：

```typescript
{
  name: 'admin_session',
  httpOnly: true,        // 防止 XSS 攻击
  sameSite: 'lax',       // 防止 CSRF 攻击
  secure: true,          // 生产环境强制 HTTPS
  path: '/',
  maxAge: 43200,         // 12 小时
}
```

## 输入验证

所有用户输入都经过验证：

- **文章数据** - 验证必填字段、slug 唯一性
- **标签名称** - 去除空格、防止重复
- **邮箱地址** - 格式验证、规范化处理
- **订阅 token** - HMAC 签名验证

## 防护措施

### 已实现

- ✅ 管理员密码认证
- ✅ Session token 验证
- ✅ 时序攻击防护
- ✅ API 频率限制
- ✅ AI API 使用限制（防止成本失控）
- ✅ CSRF 防护（SameSite cookie）
- ✅ XSS 防护（httpOnly cookie）
- ✅ 输入验证和清理
- ✅ 错误信息不泄露敏感信息
- ✅ 数据库连接配置验证（Turso 需要同时配置 URL 和 Token）

### 建议增强（可选）

- 🔄 使用 Redis 存储频率限制数据（多实例部署）
- 🔄 添加登录失败次数限制
- 🔄 实现 2FA 双因素认证
- 🔄 添加审计日志
- 🔄 实现 IP 白名单

## 安全检查清单

部署前请确认：

- [ ] `ADMIN_PASSWORD` 已设置为强密码
- [ ] `.env.local` 未提交到版本控制
- [ ] 生产环境的 cookie 使用 `secure: true`
- [ ] 所有管理员 API 都有鉴权保护
- [ ] 频率限制已启用
- [ ] 错误消息不泄露系统信息

## 报告安全问题

如果发现安全漏洞，请通过私密方式联系项目维护者，不要公开披露。

## 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/security)
- [Prisma Security Guidelines](https://www.prisma.io/docs/orm/prisma-client/deployment/security)
