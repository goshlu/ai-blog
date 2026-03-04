'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BotIcon } from 'lucide-react';

interface SmartSummaryProps {
    content: string;
}

export function SmartSummary({ content }: SmartSummaryProps) {
    const [summary, setSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    const handleGenerate = async () => {
        if (showSummary && summary) {
            setShowSummary(false);
            return;
        }

        if (summary) {
            setShowSummary(true);
            return;
        }

        setIsGenerating(true);
        setShowSummary(true);
        setSummary('');

        try {
            const response = await fetch('/api/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Summary generation failed');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No reader available');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const textContent = parsed.choices?.[0]?.delta?.content;
                            if (textContent) {
                                setSummary(prev => prev + textContent);
                            }
                        } catch {
                            // ignore parse error
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Summary error:', error);
            if (!summary) setSummary('摘要生成失败，请重试。');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 rounded-full bg-blue-50/50 hover:bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 dark:text-blue-400 font-medium transition-colors"
                >
                    <BotIcon className="w-4 h-4" />
                    {isGenerating ? 'AI 正在阅读...' : showSummary && summary ? '隐藏智能摘要' : 'AI 智能摘要'}
                </Button>
            </div>

            {showSummary && (
                <div className="mt-5 p-5 md:p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-[1.5rem] transition-all duration-300 shadow-sm">
                    <h3 className="text-[15px] font-semibold mb-3 flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                        <BotIcon className="w-4 h-4 text-blue-500" />
                        AI 摘要
                    </h3>
                    <div className="prose prose-zinc prose-base dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                        {isGenerating && !summary ? (
                            <p className="animate-pulse">正在提炼核心内容...</p>
                        ) : (
                            <p className="m-0">
                                {summary}
                                {isGenerating && <span className="animate-pulse text-blue-500 ml-1">▋</span>}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
