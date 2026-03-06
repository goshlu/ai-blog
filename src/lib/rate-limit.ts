import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  key: string;
  windowMs: number;
  max: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const globalForRateLimit = globalThis as unknown as {
  __rateLimitStore?: Map<string, Bucket>;
};

const store = globalForRateLimit.__rateLimitStore ?? new Map<string, Bucket>();
globalForRateLimit.__rateLimitStore = store;

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0]?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;

  return 'unknown';
}

function cleanupExpired(now: number) {
  if (store.size < 2048) return;

  store.forEach((bucket, key) => {
    if (bucket.resetAt <= now) {
      store.delete(key);
    }
  });
}

export function checkRateLimit(request: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  cleanupExpired(now);

  const ip = getClientIp(request);
  const bucketKey = `${options.key}:${ip}`;
  const current = store.get(bucketKey);

  if (!current || current.resetAt <= now) {
    store.set(bucketKey, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return null;
  }

  if (current.count >= options.max) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    return NextResponse.json(
      {
        success: false,
        error: '请求过于频繁，请稍后再试。',
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSeconds),
        },
      },
    );
  }

  current.count += 1;
  store.set(bucketKey, current);
  return null;
}
