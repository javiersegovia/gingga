import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { UserMemberships } from '@/db/schema'
import { resetRateLimit } from '@/lib/ratelimiter'
import { eq, or, lt, and } from 'drizzle-orm'
import { getDatabase } from '@/db'

// todo: finish cron job!

export const APIRoute = createAPIFileRoute('/api/cron/rate-limit')({
  GET: async () => {
    const db = getDatabase()
    const now = Date.now()
    let count = 0

    // Daily reset for basic tier memberships
    const basicMemberships = await db
      .select()
      .from(UserMemberships)
      .where(eq(UserMemberships.tier, 'basic'))

    for (const membership of basicMemberships) {
      // Reset the Upstash counter for basic tier for this user.
      await resetRateLimit({ identifier: membership.userId, tier: 'basic' })
      // Update the DB: reset dailyUsed and update dailyResetAt.
      await db
        .update(UserMemberships)
        .set({ dailyUsed: 0, dailyResetAt: new Date(now) })
        .where(eq(UserMemberships.userId, membership.userId))
      count++
    }

    // Monthly reset for pro and enterprise memberships if monthlyResetAt is expired
    const monthlyMemberships = await db
      .select()
      .from(UserMemberships)
      .where(
        and(
          or(eq(UserMemberships.tier, 'pro'), eq(UserMemberships.tier, 'enterprise')),
          lt(UserMemberships.monthlyResetAt, new Date(now)),
        ),
      )

    for (const membership of monthlyMemberships) {
      await resetRateLimit({
        identifier: membership.userId,
        tier: membership.tier,
        messageType: 'standard',
      })
      await resetRateLimit({
        identifier: membership.userId,
        tier: membership.tier,
        messageType: 'premium',
      })
      await db
        .update(UserMemberships)
        .set({
          monthlyStandardUsed: 0,
          monthlyPremiumUsed: 0,
          monthlyResetAt: new Date(now),
        })
        .where(eq(UserMemberships.userId, membership.userId))
      count++
    }

    return json({ message: 'Rate limit synchronization completed', count })
  },
})
