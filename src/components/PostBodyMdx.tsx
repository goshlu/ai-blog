'use client';

import { createElement, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Callout } from '@/components/mdx/Callout';
import { slugifyHeading } from '@/lib/headings';

interface PostBodyMdxProps {
  source: MDXRemoteSerializeResult;
}

function getNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }

  if (node && typeof node === 'object' && 'props' in node) {
    return getNodeText(node.props.children as ReactNode);
  }

  return '';
}

function createHeading(tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function Heading({
    children,
    ...props
  }: ComponentPropsWithoutRef<typeof tag>) {
    const text = getNodeText(children);
    const id = slugifyHeading(text);

    return createElement(
      tag,
      {
        ...props,
        id: props.id ?? (id || undefined),
        className: ['scroll-mt-24', props.className].filter(Boolean).join(' '),
      },
      children,
    );
  };
}

const components = {
  Callout,
  h1: createHeading('h1'),
  h2: createHeading('h2'),
  h3: createHeading('h3'),
  h4: createHeading('h4'),
  h5: createHeading('h5'),
  h6: createHeading('h6'),
};

export function PostBodyMdx({ source }: PostBodyMdxProps) {
  return (
    <div className="prose prose-zinc prose-lg max-w-none break-words font-normal leading-relaxed text-zinc-700 selection:bg-blue-500/20 dark:prose-invert dark:text-zinc-300">
      <MDXRemote {...source} components={components} />
    </div>
  );
}

