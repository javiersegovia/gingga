import type { UserMemberships, Users } from '@gingga/db/schema'
import type { Session as BetterAuthSessionData } from 'better-auth'

export type AppAuthSession =
  | {
    isAuthenticated: true
    session: BetterAuthSessionData
    user: typeof Users.$inferSelect
    membership: typeof UserMemberships.$inferSelect | null
  }
  | { isAuthenticated: false }
