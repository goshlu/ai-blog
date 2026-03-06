import { NextRequest } from "next/server";
import { requireAdminApiSession } from "@/lib/require-admin-api";
import { checkRateLimit } from "@/lib/rate-limit";
import { checkAiUsageLimit, estimateTokens } from "@/lib/ai-usage-tracker";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // 频率限制
    const limited = checkRateLimit(request, {
      key: "generate-post:post",
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

    const { title, excerpt } = await request.json();

    if (!title) {
      return new Response(JSON.stringify({ error: "标题不能为空" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // AI 使用限制检查
    const promptText = `${title} ${excerpt || ""}`;
    const estimatedInputTokens = estimateTokens(promptText) + 2000; // 加上系统提示和输出预估
    const usageCheck = checkAiUsageLimit(
      "global:generate-post",
      estimatedInputTokens,
      {
        maxRequests: 50, // 每小时最多 50 次
        maxTokens: 200000, // 每小时最多 20 万 tokens
        maxCost: 2.0, // 每小时最多 $2
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

    const prompt = `你是一名资深中文技术博主，请根据下方信息写一篇完整的中文博文，使用 Markdown 格式输出.

要求：
1. 语言自然、口语化但专业，适合个人博客
2. 结构包含：引言、若干小节（每节有小标题）、总结或个人思考
3. 合理穿插自己的经验、观点和反思，而不是纯科普
4. 字数大约 1200-2000 字，不要太短
5. 只输出 Markdown 正文，不要额外解释

文章标题：${title}
${excerpt ? `文章要点或补充说明：${excerpt}` : ""}`;

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
              content: "你是一位擅长写技术与效率思考博文的创作者。",
            },
            { role: "user", content: prompt },
          ],
          stream: true,
        }),
      },
    );

    // 直接将上游的 SSE 流转发给前端，实现流式写作体验
    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (error) {
    console.error("Generate post unexpected error:", error);
    return new Response(JSON.stringify({ error: "服务异常，请稍后再试" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
