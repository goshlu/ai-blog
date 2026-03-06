import { NextRequest } from "next/server";
import { requireAdminApiSession } from "@/lib/require-admin-api";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkAiUsageLimit, estimateTokens } from "@/lib/ai-usage-tracker";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 频率限制
    const limited = checkRateLimit(request, {
      key: "translate:post",
      windowMs: 60_000,
      max: 10,
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
      "global:translate",
      estimatedInputTokens,
      {
        maxRequests: 50, // 每小时最多 50 次
        maxTokens: 500000, // 每小时最多 50 万 tokens
        maxCost: 5.0, // 每小时最多 $5
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

    const prompt = `请将以下中文文章翻译成英文，保持原文的格式和风格：

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
            {
              role: "system",
              content: "你是一个翻译助手，请将中文翻译成英文。",
            },
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
    console.error("Translation error:", error);
    return new Response("Failed to translate", { status: 500 });
  }
}
