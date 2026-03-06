'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, MessageCircle, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  title: string;
  summary: string;
  path: string;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-blog-five-sigma.vercel.app';

function trimSummary(summary: string) {
  return summary.replace(/\s+/g, ' ').trim().slice(0, 120);
}

export function SocialShare({ title, summary, path }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [wechatCopied, setWechatCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(() => new URL(path, SITE_URL).toString());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setShareUrl(new URL(path, window.location.origin).toString());
  }, [path]);

  const shareText = useMemo(() => trimSummary(summary), [summary]);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title}${shareText ? ` - ${shareText}` : ''}`);

  const handleCopy = async (source: 'link' | 'wechat') => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      if (source === 'wechat') {
        setWechatCopied(true);
        window.setTimeout(() => setWechatCopied(false), 2000);
        return;
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy share link failed:', error);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await handleCopy('link');
      return;
    }

    try {
      await navigator.share({
        title,
        text: shareText,
        url: shareUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      console.error('Native share failed:', error);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Button variant="outline" size="sm" onClick={handleNativeShare}>
        <Share2 className="h-4 w-4" />
        分享
      </Button>

      <Button variant="outline" size="sm" onClick={() => handleCopy('link')}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? '已复制' : '复制链接'}
      </Button>

      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`}
          target="_blank"
          rel="noreferrer"
        >
          <Send className="h-4 w-4" />
          X
        </a>
      </Button>

      <Button variant="outline" size="sm" asChild>
        <a
          href={`https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}%20${encodedText}`}
          target="_blank"
          rel="noreferrer"
        >
          <Send className="h-4 w-4" />
          微博
        </a>
      </Button>

      <Button variant="outline" size="sm" onClick={() => handleCopy('wechat')}>
        {wechatCopied ? <Check className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        {wechatCopied ? '微信可粘贴' : '微信'}
      </Button>
    </div>
  );
}
