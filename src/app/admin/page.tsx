'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { generateSummaryAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BotIcon, Loader2 } from 'lucide-react';

const initialState = {
    summary: null,
    title: null,
    error: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? '正在生成摘要...' : '生成摘要'}
        </Button>
    );
}

export default function AdminSummaryPage() {
    const [state, formAction] = useFormState(generateSummaryAction, initialState);

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                    <BotIcon className="w-8 h-8 text-primary" />
                    管理员文章摘要控制台
                </h1>
                <p className="text-muted-foreground">
                    输入文章标题和内容，使用 Next.js Server Actions 后端逻辑一键智能生成摘要。
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium leading-none">
                                文章标题 (可选)
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="例如：Next.js 14 完全指南"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium leading-none">
                                文章正文内容
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                rows={16}
                                required
                                placeholder="在此粘贴您的 Markdown 或富文本内容..."
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                            />
                        </div>

                        <SubmitButton />
                    </form>
                </div>

                <div className="flex flex-col h-full">
                    <Card className="flex-1 shadow-sm">
                        <CardHeader className="bg-muted/50 border-b">
                            <CardTitle className="flex items-center gap-2">
                                智能生成结果
                            </CardTitle>
                            <CardDescription>
                                通过 Server Action 处理大模型调用，保护密钥并缩减前端体积。
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {state?.error && (
                                <div className="p-4 rounded-md bg-destructive/15 text-destructive font-medium border border-destructive/20 text-sm">
                                    错误：{state.error}
                                </div>
                            )}

                            {state?.summary && !state?.error && (
                                <div className="space-y-4">
                                    {state.title && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">文章：</h3>
                                            <p className="font-medium text-lg border-l-4 border-primary pl-3">
                                                {state.title}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2">摘要：</h3>
                                        <div className="prose prose-sm dark:prose-invert bg-primary/5 p-4 rounded-lg leading-relaxed text-foreground">
                                            <p className="m-0">{state.summary}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!state?.summary && !state?.error && (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-60">
                                    <BotIcon className="w-12 h-12 mb-4 text-muted-foreground" />
                                    <p>等待生成摘要...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
