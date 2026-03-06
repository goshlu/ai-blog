/**
 * AI API 使用追踪和限制
 * 防止 API 滥用和成本失控
 */

interface UsageRecord {
  count: number;
  tokens: number;
  cost: number;
  resetAt: number;
}

interface UsageLimit {
  maxRequests: number;
  maxTokens: number;
  maxCost: number; // 美元
  windowMs: number;
}

const globalForUsage = globalThis as unknown as {
  __aiUsageStore?: Map<string, UsageRecord>;
};

const store = globalForUsage.__aiUsageStore ?? new Map<string, UsageRecord>();
globalForUsage.__aiUsageStore = store;

// 默认限制：每小时
const DEFAULT_LIMITS: UsageLimit = {
  maxRequests: 100, // 每小时最多 100 次请求
  maxTokens: 500000, // 每小时最多 50 万 tokens
  maxCost: 5.0, // 每小时最多 $5
  windowMs: 60 * 60 * 1000, // 1 小时
};

// DeepSeek 定价（参考）
const DEEPSEEK_PRICING = {
  inputTokenPer1M: 0.14, // $0.14 per 1M input tokens
  outputTokenPer1M: 0.28, // $0.28 per 1M output tokens
};

/**
 * 估算 token 数量（粗略估计）
 */
function estimateTokens(text: string): number {
  // 中文：约 1.5 字符 = 1 token
  // 英文：约 4 字符 = 1 token
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const otherChars = text.length - chineseChars;

  return Math.ceil(chineseChars / 1.5 + otherChars / 4);
}

/**
 * 估算 API 调用成本
 */
function estimateCost(inputTokens: number, outputTokens: number = 0): number {
  const inputCost = (inputTokens / 1000000) * DEEPSEEK_PRICING.inputTokenPer1M;
  const outputCost =
    (outputTokens / 1000000) * DEEPSEEK_PRICING.outputTokenPer1M;
  return inputCost + outputCost;
}

/**
 * 清理过期记录
 */
function cleanupExpired(now: number) {
  if (store.size < 100) return;

  store.forEach((record, key) => {
    if (record.resetAt <= now) {
      store.delete(key);
    }
  });
}

/**
 * 检查 AI API 使用限制
 * @param key 限制键（如 'user:123' 或 'global'）
 * @param estimatedInputTokens 预估的输入 token 数
 * @param limits 自定义限制（可选）
 * @returns 如果超限返回错误信息，否则返回 null
 */
export function checkAiUsageLimit(
  key: string,
  estimatedInputTokens: number,
  limits: Partial<UsageLimit> = {},
): { allowed: boolean; error?: string; remaining?: number } {
  const now = Date.now();
  cleanupExpired(now);

  const effectiveLimits = { ...DEFAULT_LIMITS, ...limits };
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    // 初始化新的使用记录
    const estimatedCost = estimateCost(estimatedInputTokens);
    store.set(key, {
      count: 1,
      tokens: estimatedInputTokens,
      cost: estimatedCost,
      resetAt: now + effectiveLimits.windowMs,
    });
    return { allowed: true, remaining: effectiveLimits.maxRequests - 1 };
  }

  // 检查请求次数限制
  if (current.count >= effectiveLimits.maxRequests) {
    return {
      allowed: false,
      error: `已达到请求次数限制（${effectiveLimits.maxRequests} 次/小时）`,
    };
  }

  // 检查 token 限制
  const newTokenCount = current.tokens + estimatedInputTokens;
  if (newTokenCount > effectiveLimits.maxTokens) {
    return {
      allowed: false,
      error: `已达到 token 使用限制（${effectiveLimits.maxTokens} tokens/小时）`,
    };
  }

  // 检查成本限制
  const estimatedCost = estimateCost(estimatedInputTokens);
  const newCost = current.cost + estimatedCost;
  if (newCost > effectiveLimits.maxCost) {
    return {
      allowed: false,
      error: `已达到成本限制（$${effectiveLimits.maxCost}/小时）`,
    };
  }

  // 更新使用记录
  current.count += 1;
  current.tokens = newTokenCount;
  current.cost = newCost;
  store.set(key, current);

  return {
    allowed: true,
    remaining: effectiveLimits.maxRequests - current.count,
  };
}

/**
 * 记录实际的 AI API 使用情况
 * 在收到响应后调用，更新实际的 token 使用量
 */
export function recordAiUsage(
  key: string,
  actualInputTokens: number,
  actualOutputTokens: number,
) {
  const current = store.get(key);
  if (!current) return;

  const actualCost = estimateCost(actualInputTokens, actualOutputTokens);

  // 更新为实际值
  current.tokens = actualInputTokens + actualOutputTokens;
  current.cost = actualCost;
  store.set(key, current);
}

/**
 * 获取当前使用统计
 */
export function getAiUsageStats(key: string): UsageRecord | null {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    return null;
  }

  return { ...current };
}

/**
 * 从文本估算 token 数量（导出供外部使用）
 */
export { estimateTokens };
