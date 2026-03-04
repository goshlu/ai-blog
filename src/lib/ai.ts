import { generateText, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(content: string): Promise<string> {
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
    }),
  });

  if (!response.ok) {
    throw new Error(`API returned ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function* translateToEnglish(content: string) {
  const prompt = `请将以下中文文章翻译成英文，保持原文的格式和风格：

${content}`;

  const result = await streamText({
    model: deepseek('deepseek-chat'),
    messages: [
      { role: 'system', content: '你是一个翻译助手，请将中文翻译成英文。' },
      { role: 'user', content: prompt }
    ],
  });

  for await (const chunk of result.textStream) {
    yield chunk;
  }
}
