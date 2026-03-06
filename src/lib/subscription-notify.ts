import prisma from '@/lib/db';

interface PublishNotifyPost {
  id: string;
  title: string;
  excerpt?: string | null;
  date: string;
}

interface NotifyResult {
  enabled: boolean;
  attempted: number;
  delivered: number;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-blog-five-sigma.vercel.app';

function buildEmailText(post: PublishNotifyPost, postUrl: string, unsubscribeUrl: string) {
  const excerpt = post.excerpt?.trim() || '博客发布了新文章，点击查看完整内容。';
  return [
    `Hi,`,
    '',
    `《${post.title}》已发布。`,
    '',
    excerpt,
    '',
    `阅读地址: ${postUrl}`,
    `退订通知: ${unsubscribeUrl}`,
  ].join('\n');
}

function buildEmailHtml(post: PublishNotifyPost, postUrl: string, unsubscribeUrl: string) {
  const excerpt = post.excerpt?.trim() || '博客发布了新文章，点击查看完整内容。';
  return [
    '<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">',
    '<h2 style="margin:0 0 12px">博客更新通知</h2>',
    `<p style="margin:0 0 12px">《${post.title}》已发布。</p>`,
    `<p style="margin:0 0 12px">${excerpt}</p>`,
    `<p style="margin:0 0 8px"><a href="${postUrl}">点击阅读全文</a></p>`,
    `<p style="margin:0;color:#6b7280;font-size:12px"><a href="${unsubscribeUrl}">退订邮件通知</a></p>`,
    '</div>',
  ].join('');
}

async function postWebhook(payload: Record<string, unknown>) {
  const webhook = process.env.SUBSCRIPTION_WEBHOOK_URL;
  if (!webhook) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function notifySubscribersOfNewPost(post: PublishNotifyPost): Promise<NotifyResult> {
  if (!process.env.SUBSCRIPTION_WEBHOOK_URL) {
    return { enabled: false, attempted: 0, delivered: 0 };
  }

  const subscribers = await prisma.subscriber.findMany({
    where: { isActive: true },
    select: { email: true, name: true },
    take: 1000,
    orderBy: { subscribedAt: 'asc' },
  });

  if (subscribers.length === 0) {
    return { enabled: true, attempted: 0, delivered: 0 };
  }

  const postUrl = new URL(`/posts/${post.id}`, SITE_URL).toString();

  const jobs = subscribers.map(async (subscriber) => {
    const unsubscribeUrl = new URL('/subscribe', SITE_URL);
    unsubscribeUrl.searchParams.set('action', 'unsubscribe');
    unsubscribeUrl.searchParams.set('email', subscriber.email);

    const payload = {
      to: subscriber.email,
      subject: `博客更新：${post.title}`,
      text: buildEmailText(post, postUrl, unsubscribeUrl.toString()),
      html: buildEmailHtml(post, postUrl, unsubscribeUrl.toString()),
      metadata: {
        source: 'blog-subscription',
        postId: post.id,
        postDate: post.date,
        subscriberName: subscriber.name,
      },
    };

    return postWebhook(payload);
  });

  const results = await Promise.allSettled(jobs);
  const delivered = results.filter(
    (result) => result.status === 'fulfilled' && result.value,
  ).length;

  return {
    enabled: true,
    attempted: subscribers.length,
    delivered,
  };
}
