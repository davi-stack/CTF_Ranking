import { NextRequest } from "next/server";

type RateLimitConfig = {
  limit: number;
  windowMs: number;
  lockMs?: number;
};

type RateLimitBucket = {
  hits: number[];
  lockedUntil: number;
};

const rateLimitStore = globalThis as typeof globalThis & {
  __rateLimitStore?: Map<string, RateLimitBucket>;
};

const buckets = rateLimitStore.__rateLimitStore ?? new Map<string, RateLimitBucket>();
rateLimitStore.__rateLimitStore = buckets;

export const loginRateLimit: RateLimitConfig = {
  limit: 6,
  windowMs: 10 * 60 * 1000,
  lockMs: 15 * 60 * 1000,
};

export const submitRateLimit: RateLimitConfig = {
  limit: 12,
  windowMs: 60 * 1000,
  lockMs: 3 * 60 * 1000,
};

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export function checkRateLimit(key: string, config: RateLimitConfig) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [], lockedUntil: 0 };

  if (bucket.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.lockedUntil - now) / 1000),
      remaining: 0,
    };
  }

  bucket.hits = bucket.hits.filter((timestamp) => now - timestamp <= config.windowMs);

  if (bucket.hits.length >= config.limit) {
    bucket.lockedUntil = now + (config.lockMs ?? config.windowMs);
    buckets.set(key, bucket);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.lockedUntil - now) / 1000),
      remaining: 0,
    };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: Math.max(config.limit - bucket.hits.length, 0),
  };
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}

export function assertSameOrigin(request: NextRequest) {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}