import type { BanUserInput, BaseUser, UpdateUserInput } from './user.schema'
import { count, desc, eq } from '@gingga/db'
import { ChatMessages, Chats, UserMemberships, Users } from '@gingga/db/schema'
import { getDatabase } from '~/middleware/setup-context.server'

// Helper function to potentially throw specific errors (e.g., NotFoundError)
class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export async function getUsers() {
  const db = getDatabase()
  try {
    // Main query to get users with basic data
    const users = await db
      .select({
        id: Users.id,
        name: Users.name,
        firstName: Users.firstName,
        lastName: Users.lastName,
        email: Users.email,
        emailVerified: Users.emailVerified,
        image: Users.image,
        role: Users.role,
        banned: Users.banned,
        banReason: Users.banReason,
        banExpires: Users.banExpires,
        createdAt: Users.createdAt,
        updatedAt: Users.updatedAt,
        membershipTier: UserMemberships.tier,
      })
      .from(Users)
      .leftJoin(UserMemberships, eq(Users.id, UserMemberships.userId))
      .orderBy(desc(Users.createdAt))

    // Get chat counts for all users in a single query
    const chatCounts = await db
      .select({
        userId: Chats.userId,
        count: count(),
      })
      .from(Chats)
      .groupBy(Chats.userId)

    // Get message counts for all users in a single query
    const messageCounts = await db
      .select({
        userId: Chats.userId,
        count: count(),
      })
      .from(ChatMessages)
      .innerJoin(Chats, eq(ChatMessages.chatId, Chats.id))
      .groupBy(Chats.userId)

    // Convert to maps for easier lookup
    const chatCountMap = new Map(chatCounts.map(cc => [cc.userId, cc.count]))
    const messageCountMap = new Map(messageCounts.map(mc => [mc.userId, mc.count]))

    // Merge the data
    return users.map(user => ({
      ...user,
      chatCount: chatCountMap.get(user.id) || 0,
      messageCount: messageCountMap.get(user.id) || 0,
    }))
  }
  catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to retrieve users.')
  }
}

export async function getUserById(userId: string): Promise<BaseUser | null> {
  const db = getDatabase()
  try {
    // Get user details
    const userResult = await db.select().from(Users).where(eq(Users.id, userId)).limit(1)
    if (userResult.length === 0) {
      return null
    }
    const user = userResult[0]

    // Get membership data
    const membershipResult = await db
      .select()
      .from(UserMemberships)
      .where(eq(UserMemberships.userId, userId))
      .limit(1)

    const membership = membershipResult[0]

    // Get chat count
    const chatCountResult = await db
      .select({ count: count() })
      .from(Chats)
      .where(eq(Chats.userId, userId))

    // Get message count
    const messageCountResult = await db
      .select({ count: count() })
      .from(ChatMessages)
      .innerJoin(Chats, eq(ChatMessages.chatId, Chats.id))
      .where(eq(Chats.userId, userId))

    // Return with all data
    return {
      ...user,
      membershipTier: membership?.tier || null,
      chatCount: chatCountResult[0]?.count || 0,
      messageCount: messageCountResult[0]?.count || 0,
    }
  }
  catch (error) {
    console.error(`Error fetching user ${userId}:`, error)
    throw new Error('Failed to retrieve user details.')
  }
}

export async function updateUser(input: UpdateUserInput): Promise<BaseUser> {
  const { userId, membershipTier, ...updateData } = input
  const db = getDatabase()

  // Start transaction to update both user and membership if needed
  try {
    // First update the user record
    if (Object.keys(updateData).length === 0 && !membershipTier) {
      // Avoid empty update, fetch and return current user
      const currentUser = await getUserById(userId)
      if (!currentUser)
        throw new NotFoundError(`User with id ${userId} not found.`)
      return currentUser
    }

    // Update user data if there's anything to update
    if (Object.keys(updateData).length > 0) {
      const result = await db
        .update(Users)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(Users.id, userId))
        .returning()

      if (result.length === 0) {
        throw new NotFoundError(`User with id ${userId} not found for update.`)
      }
    }

    // Update membership tier if specified
    if (membershipTier) {
      // Check if user has an existing membership
      const existingMembership = await db
        .select()
        .from(UserMemberships)
        .where(eq(UserMemberships.userId, userId))
        .limit(1)

      if (existingMembership.length > 0) {
        // Update existing membership
        await db
          .update(UserMemberships)
          .set({ tier: membershipTier })
          .where(eq(UserMemberships.userId, userId))
      }
      else {
        // Create new membership
        await db.insert(UserMemberships).values({
          userId,
          tier: membershipTier,
        })
      }
    }

    // Get updated user with membership data
    return getUserById(userId) as Promise<BaseUser>
  }
  catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    if (error instanceof NotFoundError)
      throw error
    throw new Error('Failed to update user.')
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  const db = getDatabase()
  try {
    // Note: Users table doesn't have deletedAt, so this is a hard delete.
    const result = await db
      .delete(Users)
      .where(eq(Users.id, userId))
      .returning({ id: Users.id })
    if (result.length === 0) {
      throw new NotFoundError(`User with id ${userId} not found for deletion.`)
    }
    return true
  }
  catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    if (error instanceof NotFoundError)
      throw error
    throw new Error('Failed to delete user.')
  }
}

export async function banUser(input: BanUserInput): Promise<boolean> {
  const { userId, banReason, banDurationDays } = input
  const db = getDatabase()

  let banExpires: Date | null = null
  if (banDurationDays) {
    banExpires = new Date()
    banExpires.setDate(banExpires.getDate() + banDurationDays)
  }

  try {
    const result = await db
      .update(Users)
      .set({
        banned: true,
        banReason,
        banExpires,
        updatedAt: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning({ id: Users.id })

    if (result.length === 0) {
      throw new NotFoundError(`User with id ${userId} not found for banning.`)
    }
    // console.log(
    //   `SERVICE: User ${userId} banned. Reason: ${banReason}, Expires: ${banExpires?.toISOString() ?? 'Never'}`,
    // )
    return true
  }
  catch (error) {
    console.error(`Error banning user ${userId}:`, error)
    if (error instanceof NotFoundError)
      throw error
    throw new Error('Failed to ban user.')
  }
}

export async function unbanUser(userId: string): Promise<boolean> {
  const db = getDatabase()
  try {
    const result = await db
      .update(Users)
      .set({
        banned: false,
        banReason: null,
        banExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(Users.id, userId))
      .returning({ id: Users.id })

    if (result.length === 0) {
      throw new NotFoundError(`User with id ${userId} not found for unbanning.`)
    }
    // console.log(`SERVICE: User ${userId} unbanned.`)
    return true
  }
  catch (error) {
    console.error(`Error unbanning user ${userId}:`, error)
    if (error instanceof NotFoundError)
      throw error
    throw new Error('Failed to unban user.')
  }
}

export async function impersonateUser(
  userId: string,
  // adminUserId: string,
): Promise<void> {
  // Placeholder for actual impersonation logic (e.g., using Better Auth)
  // console.log(`SERVICE: Admin ${adminUserId} attempting to impersonate user ${userId}`)
  // In a real scenario, this would likely involve:
  // 1. Verifying admin privileges (already done by middleware in API layer)
  // 2. Verifying target user exists and is not an admin themselves.
  // 3. Generating a special session token or modifying the current session
  //    to include an `impersonatedBy` field, as per the Sessions schema.
  // 4. Potentially logging this action for security audits.

  // Check if user exists (optional, API layer might handle 404)
  const user = await getUserById(userId)
  if (!user) {
    throw new NotFoundError(`User with id ${userId} not found for impersonation.`)
  }
  if (user.role === 'admin') {
    throw new Error('Cannot impersonate another admin.')
  }

  // Simulate successful impersonation attempt
  // console.log(`SERVICE: Impersonation logic for user ${userId} would execute here.`)
  return Promise.resolve() // No return value needed typically
}
