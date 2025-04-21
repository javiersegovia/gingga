import type { UserMemberships, Users } from '@gingga/db/schema'
import { eq } from '@gingga/db'
import { Agents } from '@gingga/db/schema'
import { getDatabase } from '~/middleware/setup-context.server'

// Define types based on schema for clarity
type User = typeof Users.$inferSelect
type UserMembership = typeof UserMemberships.$inferSelect

/**
 * Checks if the user has the 'admin' role.
 * @param user - The user object.
 * @returns True if the user is an admin, false otherwise.
 */
export function isAdmin(user: Pick<User, 'role'>): boolean {
  return user.role === 'admin'
}

/**
 * Checks if a user owns a specific agent.
 * Requires database access.
 * @param userId - The ID of the user.
 * @param agentId - The ID of the agent.
 * @returns Promise<boolean> - True if the user owns the agent, false otherwise.
 */
export async function isAgentOwner(userId: string, agentId: string): Promise<boolean> {
  if (!userId || !agentId) {
    return false
  }
  try {
    const db = getDatabase()
    const agent = await db
      .select({ ownerId: Agents.ownerId })
      .from(Agents)
      .where(eq(Agents.id, agentId))
      .get() // Use .get() for single record fetch

    return !!agent && agent.ownerId === userId
  }
  catch (error) {
    console.error('Error checking agent ownership:', error)
    return false // Fail safely
  }
}

/**
 * Checks if the user has a 'pro' membership tier.
 * @param membership - The user's membership object.
 * @returns True if the user has a pro membership, false otherwise.
 */
export function hasProMembership(membership: Pick<UserMembership, 'tier'> | null | undefined): boolean {
  return membership?.tier === 'pro'
}

/**
 * Checks if the user has an 'enterprise' membership tier.
 * @param membership - The user's membership object.
 * @returns True if the user has an enterprise membership, false otherwise.
 */
export function hasEnterpriseMembership(membership: Pick<UserMembership, 'tier'> | null | undefined): boolean {
  return membership?.tier === 'enterprise'
}
