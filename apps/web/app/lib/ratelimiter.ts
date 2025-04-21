/* eslint-disable jsdoc/check-param-names */
import type { UserMemberships } from '@gingga/db/schema'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { getServerEnv } from '~/server/env'

export type Tier = 'public' | (typeof UserMemberships.tier.enumValues)[number]
export type MessageType = 'standard' | 'premium'

const env = getServerEnv()

// Initialize Redis client via environment variables
const redis = new Redis({
  url: env.KV_REST_API_URL,
  token: env.KV_REST_API_TOKEN,
})

// Define rate limiter configurations for each tier/messageType
const rateLimiterConfigs = {
  public: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '24 h'),
    analytics: true,
    prefix: 'public',
  }),
  basic: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '24 h'),
    analytics: true,
    prefix: 'basic',
  }),
  pro: {
    standard: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(1500, '30 d'),
      analytics: true,
      prefix: 'pro-standard',
    }),
    premium: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '30 d'),
      analytics: true,
      prefix: 'pro-premium',
    }),
  },
  enterprise: {
    standard: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5000, '30 d'),
      analytics: true,
      prefix: 'enterprise-standard',
    }),
    premium: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(500, '30 d'),
      analytics: true,
      prefix: 'enterprise-premium',
    }),
  },
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  reset: number
  pending: Promise<unknown>
  reason?: string
  deniedValue?: string
}

/**
 * rateLimit function to enforce credit-based rate limiting based on user tier and optional message type.
 *
 * @param identifier - Unique identifier (IP address for anonymous users or userId for authenticated users)
 * @param tier - Membership tier ('public', 'basic', 'pro', 'enterprise')
 * @param messageType - For 'pro' and 'enterprise', can be 'standard' or 'premium'. Defaults to 'standard'.
 * @param cost - Number of messages (credits) to consume for this operation, default is 1.
 *
 * @returns RateLimitResult containing success, remaining quota, reset timestamp and pending promise.
 */
export async function rateLimit({
  identifier,
  tier,
  messageType = 'standard',
  cost = 1,
}: {
  identifier: string
  tier: Tier
  messageType?: MessageType
  cost?: number
}): Promise<RateLimitResult> {
  let limiter
  switch (tier) {
    case 'public':
      limiter = rateLimiterConfigs.public
      break

    case 'basic':
      limiter = rateLimiterConfigs.basic
      break

    case 'pro':
      limiter
        = messageType === 'premium'
          ? rateLimiterConfigs.pro.premium
          : rateLimiterConfigs.pro.standard
      break

    case 'enterprise':
      limiter
        = messageType === 'premium'
          ? rateLimiterConfigs.enterprise.premium
          : rateLimiterConfigs.enterprise.standard
      break

    default:
      throw new Error(`Unknown tier: ${tier}`)
  }

  return limiter.limit(identifier, { rate: cost })
}

/**
 * Optional helper to reset the rate limit for an identifier, useful for tests or administrative overrides.
 */
export async function resetRateLimit({
  identifier,
  tier,
  messageType = 'standard',
}: {
  identifier: string
  tier: Tier
  messageType?: MessageType
}): Promise<void> {
  let limiter
  switch (tier) {
    case 'public':
      limiter = rateLimiterConfigs.public
      break
    case 'basic':
      limiter = rateLimiterConfigs.basic
      break
    case 'pro':
      limiter
        = messageType === 'premium'
          ? rateLimiterConfigs.pro.premium
          : rateLimiterConfigs.pro.standard
      break
    case 'enterprise':
      limiter
        = messageType === 'premium'
          ? rateLimiterConfigs.enterprise.premium
          : rateLimiterConfigs.enterprise.standard
      break
    default:
      throw new Error(`Unknown tier: ${tier}`)
  }
  await limiter.resetUsedTokens(identifier)
}

// Additional improvements:
// - Consider integrating a scheduled job to reset or update the 'UserMemberships' table fields (dailyResetAt, monthlyResetAt, dailyUsed, monthlyStandardUsed, monthlyPremiumUsed) to synchronize
//   the limits stored in your database with the Upstash counters, for improved auditing and user notifications.
// - Log rate limit breaches and analytics for proactive system monitoring and adjustments.
// - Enhance the rateLimit function to support dynamic token consumption based on request payloads (e.g., AI model usage cost).
