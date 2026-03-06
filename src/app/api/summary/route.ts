import { NextRequest } from "next/server";
import { requireAdminApiSession } from "@/lib/require-admin-api";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkAiUsageLimit, estimateTokens } from "@/lib/ai-usage-tracker";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 频率限制
    const limited = checkRateLimit(request, {
      key: "summary:post",
      windowMs: 60_000,
      max: 20,
    });
    if (limited) {
      return limited;
    }

    // 管理员鉴权
    const unauthorized = requireAdminApiSession(request);
    if (unauthorized) {
      return unauthorized;
    }

    const { content } = await request.json();

    if (!content) {
      return new Response("Content is required", { status: 400 });
    }

    // AI 使用限制检查
    const estimatedInputTokens = estimateTokens(content) + 500; // 加上系统提示
    const usageCheck = checkAiUsageLimit(
      "global:summary",
      estimatedInputTokens,
      {
        maxRequests: 100, // 每小时最多 100 次
        maxTokens: 300000, // 每小时最多 30 万 tokens
        maxCost: 3.0, // 每小时最多 $3
      },
    );

    if (!usageCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: usageCheck.error || "AI 使用已达到限制，请稍后再试",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": String(usageCheck.remaining || 0),
          },
        },
      );
    }

    const prompt = `请为以下文章生成一段 50-100 字的中文摘要。要求：
1. 简洁概括文章核心内容
2. 不要使用标题格式
3. 直接返回摘要文字，不要有额外说明

文章内容：
${content}`;

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "你是一个博客摘要生成助手。" },
            { role: "user", content: prompt },
          ],
          stream: true,
        }),
      },
    );

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Summary generation error:", error);
    return new Response("Failed to generate summary", { status: 500 });
  }
}
