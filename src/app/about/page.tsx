import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="mb-8 inline-block">
        <Button variant="ghost">← 返回首页</Button>
      </Link>

      <h1 className="text-4xl font-bold mb-6">关于我</h1>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <p className="mb-4">
            你好！我是一名热爱技术的开发者，专注于 Web 开发和人工智能应用。
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">技术栈</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">前端</h3>
            <p className="text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">后端</h3>
            <p className="text-muted-foreground">Node.js, Python</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">AI</h3>
            <p className="text-muted-foreground">OpenAI, Vercel AI SDK</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">数据库</h3>
            <p className="text-muted-foreground">PostgreSQL, MongoDB</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">联系方式</h2>
      <Card>
        <CardContent className="pt-6">
          <p>欢迎通过 GitHub 或邮箱与我交流！</p>
        </CardContent>
      </Card>
    </div>
  );
}
