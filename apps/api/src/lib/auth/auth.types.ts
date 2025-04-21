import type { Session as BetterAuthSessionData } from 'better-auth'
import type { Users, UserMemberships } from '@gingga/db/schema'

export type AppAuthSession =
  | {
      isAuthenticated: true
      session: BetterAuthSessionData
      user: typeof Users.$inferSelect
      membership: typeof UserMemberships.$inferSelect | null
    }
  | { isAuthenticated: false }
