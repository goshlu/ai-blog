export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { content } = await request.json();

  if (!content) {
    return new Response('Content is required', { status: 400 });
  }

  const prompt = `请将以下中文文章翻译成英文，保持原文的格式和风格：

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
        { role: 'system', content: '你是一个翻译助手，请将中文翻译成英文。' },
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
}
