'use server';

import { generateSummary } from '@/lib/ai';

interface SummaryState {
    summary: string | null;
    title: string | null;
    error: string | null;
}

export async function generateSummaryAction(
    prevState: SummaryState,
    formData: FormData
): Promise<SummaryState> {
    const content = formData.get('content') as string;
    const title = formData.get('title') as string;

    if (!content || content.trim() === '') {
        return { summary: null, title: null, error: '文章内容不能为空' };
    }

    try {
        const summary = await generateSummary(content);
        return { summary, title, error: null };
    } catch (error) {
        console.error('Action error:', error);
        return { summary: null, title: null, error: '生成摘要失败，请重试' };
    }
}
