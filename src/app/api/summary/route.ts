export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { content } = await request.json();

        if (!content) {
            return new Response('Content is required', { status: 400 });
        }

        const prompt = `请为以下文章生成一段 50-100 字的中文摘要。要求：
1. 简洁概括文章核心内容
2. 不要使用标题格式
3. 直接返回摘要文字，不要有额外说明

文章内容：
${content}`;

        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是一个博客摘要生成助手。' },
                    { role: 'user', content: prompt }
                ],
                stream: true,
            }),
        });

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
            },
        });
    } catch (error) {
        console.error('Summary generation error:', error);
        return new Response('Failed to generate summary', { status: 500 });
    }
}
