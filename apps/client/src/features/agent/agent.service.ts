import type { CreateAgentInput, UpdateAgentInput } from './agent.schema'
import type { Agent } from './agent.types'
import { and, desc, eq, isNotNull, max } from '@gingga/db'
import { Agents, Chats } from '@gingga/db/schema'
import { getDB } from '~/server/context.server'

/**
 * Fetches the configuration for a specific agent from the database.
 * @param agentId The ID of the agent
 * @returns The agent configuration object or null if not found.
 */
export async function getAgentById(agentId: string) {
  try {
    const db = getDB()
    const agent = await db.query.Agents.findFirst({
      where: eq(Agents.id, agentId),
      with: {
        agentSkills: true,
      },
    })

    if (!agent) {
      return null
    }

    return agent
  }
  catch (error) {
    console.error(`Failed to fetch agent config for ID: ${agentId}`, error)
    // Consider throwing a specific error for tRPC to handle
    throw new Error(`Failed to fetch agent with ID: ${agentId}`)
  }
}

/**
 * Creates a new agent in the database.
 * @param data The agent configuration data
 * @returns The created agent configuration
 */
export async function createAgent(
  data: CreateAgentInput,
) {
  try {
    const db = getDB() // Use the imported function
    // const userId = await getUserId() // Get current user ID

    // Ensure starters is an array, defaulting to empty if not provided
    const starters = data.starters ?? []

    const [agent] = await db
      .insert(Agents)
      .values({
        // ownerId: userId, // Assign ownership
        ...data,
        starters, // Use potentially defaulted starters
      })
      .returning()

    return agent
  }
  catch (error) {
    console.error('Failed to create agent:', error)
    throw new Error('Failed to create agent')
  }
}

/**
 * Updates an existing agent in the database.
 * @param data The updated agent configuration data including the ID
 * @returns The updated agent configuration
 */
export async function updateAgentById(data: UpdateAgentInput): Promise<Agent | null> {
  try {
    const db = getDB() // Use the imported function
    const { id, ...updateData } = data

    // Ensure starters is handled correctly if provided (null or array)
    const updatePayload: Partial<typeof Agents.$inferInsert> = {
      ...updateData,
      updatedAt: new Date(),
    }

    // Explicitly handle starters if it's part of the update data
    if ('starters' in updateData) {
      updatePayload.starters = updateData.starters ?? []
    }

    const [agent] = await db
      .update(Agents)
      .set(updatePayload)
      .where(eq(Agents.id, id))
      .returning()

    if (!agent) {
      return null // Or throw NOT_FOUND error
    }

    return agent
  }
  catch (error) {
    console.error(`Failed to update agent with ID: ${data.id}`, error)
    throw new Error('Failed to update agent')
  }
}

/**
 * Deletes an agent from the database.
 * @param agentId The ID of the agent to delete
 * @returns true if the agent was deleted, false otherwise
 */
export async function deleteAgentById(agentId: string): Promise<{ success: boolean }> {
  try {
    const db = getDB() // Use the imported function
    const [result] = await db
      .delete(Agents)
      .where(eq(Agents.id, agentId))
      .returning({ id: Agents.id })

    return { success: result?.id !== undefined }
  }
  catch (error) {
    console.error(`Failed to delete agent with ID: ${agentId}`, error)
    throw new Error('Failed to delete agent')
  }
}

/**
 * Lists all agents from the database.
 * @returns Array of agent configurations
 */
export async function getAgents(): Promise<Agent[]> {
  try {
    const db = getDB() // Use the imported function
    return await db.query.Agents.findMany({
      orderBy: desc(Agents.createdAt),
    })
  }
  catch (error) {
    console.error('Failed to list agents:', error)
    throw new Error('Failed to list agents')
  }
}

/**
 * Fetches the most recently used agents for a specific user based on chat history.
 * @param userId The ID of the user.
 * @param limit The maximum number of recent agents to return (default: 5).
 * @returns A promise that resolves to an array of recent agent data (id, name, image).
 */
export async function getRecentAgentsForUser(
  userId: string,
  limit: number = 5,
): Promise<Pick<Agent, 'id' | 'name' | 'image'>[]> {
  const db = getDB() // Use the imported function
  try {
    const latestChatsSubquery = db.$with('latest_chats').as(
      db
        .select({
          agentId: Chats.agentId,
          lastUsedAt: max(Chats.createdAt).as('last_used_at'),
        })
        .from(Chats)
        .where(and(eq(Chats.userId, userId), isNotNull(Chats.agentId)))
        .groupBy(Chats.agentId),
    )

    const recentAgents = await db
      .with(latestChatsSubquery)
      .select({
        id: Agents.id,
        name: Agents.name,
        image: Agents.image,
        lastUsedAt: latestChatsSubquery.lastUsedAt,
      })
      .from(Agents)
      .innerJoin(latestChatsSubquery, eq(Agents.id, latestChatsSubquery.agentId))
      .orderBy(desc(latestChatsSubquery.lastUsedAt))
      .limit(limit)

    return recentAgents.map((agent: { id: string, name: string, image: string | null }): Pick<Agent, 'id' | 'name' | 'image'> => ({
      id: agent.id,
      name: agent.name,
      image: agent.image,
    }))
  }
  catch (error) {
    console.error(`Database error fetching recent agents for user ${userId}:`, error)
    throw new Error('Database query failed while fetching recent agents.')
  }
}
