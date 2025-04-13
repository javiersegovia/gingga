import { UserMemberships } from '@/db/schema'
import { rateLimit, RateLimitResult, Tier } from '@/lib/ratelimiter'
import { eq } from 'drizzle-orm'
import { getDatabase } from '@/db'
import { ipAddress, waitUntil } from '@vercel/functions'

export interface RateLimitContext {
  identifier: string
  tier: Tier
  isAuthenticated: boolean
}

export interface ValidateRateLimitOptions {
  messageType?: 'standard' | 'premium'
  cost?: number
}

export interface ValidateRateLimitResult extends RateLimitResult {
  identifier: string
  tier: Tier
}

interface CheckRateLimitArgs {
  request: Request
  userId: string | null
  options?: ValidateRateLimitOptions
}

/**
 * Helper function that combines getting context and validating rate limit
 * in a single call. Useful when you don't need the context for other purposes.
 */
export async function checkRateLimit({
  request,
  userId,
  options = {},
}: CheckRateLimitArgs): Promise<ValidateRateLimitResult> {
  let tier: Tier = 'public'

  // Get identifier (IP address for anonymous, userId for authenticated)
  let identifier =
    ipAddress(request) || request.headers.get('x-forwarded-for') || 'anonymous'
  const db = getDatabase()

  if (userId) {
    identifier = userId

    // Query user's membership tier
    const [membership] = await db
      .select()
      .from(UserMemberships)
      .where(eq(UserMemberships.userId, userId))

    if (membership) {
      tier = membership.tier
    }
  }

  const { messageType = 'standard', cost = 1 } = options
  const { success, remaining, reset, pending } = await rateLimit({
    identifier,
    tier,
    messageType,
    cost,
  })

  waitUntil(pending)

  return {
    success,
    remaining,
    reset,
    pending,
    identifier,
    tier,
  }
}
