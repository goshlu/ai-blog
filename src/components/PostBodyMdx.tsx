'use client';

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Callout } from '@/components/mdx/Callout';

interface PostBodyMdxProps {
  source: MDXRemoteSerializeResult;
}

const components = {
  Callout,
};

export function PostBodyMdx({ source }: PostBodyMdxProps) {
  return (
    <div className="prose prose-zinc prose-lg dark:prose-invert max-w-none break-words text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal selection:bg-blue-500/20">
      <MDXRemote {...source} components={components} />
    </div>
  );
}

