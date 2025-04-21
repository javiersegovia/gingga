import { getDatabase } from '~/middleware/setup-context.server'
import { Agents, Chats } from '@gingga/db/schema'
import { eq, and, desc, max, isNotNull } from '@gingga/db'
import type { AgentFormValues } from './agent.schema'
import type { Agent } from '@gingga/db/types'

/**
 * Fetches the configuration for a specific agent from the database.
 * @param agentId The ID of the agent
 * @returns The agent configuration object or null if not found.
 */
export async function getAgentById(agentId: string) {
  try {
    const db = getDatabase()
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
  } catch (error) {
    console.error(`Failed to fetch agent config for ID: ${agentId}`, error)
    return null
  }
}

/**
 * Creates a new agent in the database.
 * @param data The agent configuration data
 * @returns The created agent configuration
 */
export async function createAgent(data: AgentFormValues): Promise<Agent> {
  try {
    const db = getDatabase()
    const [agent] = await db
      .insert(Agents)
      .values({
        ...data,
      })
      .returning()

    return agent
  } catch (error) {
    console.error('Failed to create agent:', error)
    throw new Error('Failed to create agent')
  }
}

/**
 * Updates an existing agent in the database.
 * @param agentId The ID of the agent to update
 * @param data The updated agent configuration data
 * @returns The updated agent configuration
 */
export async function updateAgentById(
  agentId: string,
  data: AgentFormValues,
): Promise<Agent | null> {
  try {
    const db = getDatabase()
    const [agent] = await db
      .update(Agents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(Agents.id, agentId))
      .returning()

    if (!agent) {
      return null
    }

    return agent
  } catch (error) {
    console.error(`Failed to update agent with ID: ${agentId}`, error)
    throw new Error('Failed to update agent')
  }
}

/**
 * Deletes an agent from the database.
 * @param agentId The ID of the agent to delete
 * @returns true if the agent was deleted, false otherwise
 */
export async function deleteAgentById(agentId: string): Promise<boolean> {
  try {
    const db = getDatabase()
    const [result] = await db
      .delete(Agents)
      .where(eq(Agents.id, agentId))
      .returning({ id: Agents.id })

    return result?.id !== undefined
  } catch (error) {
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
    const db = getDatabase()
    return await db.query.Agents.findMany({
      orderBy: desc(Agents.createdAt),
    })
  } catch (error) {
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
export async function getRecentAgentsForUser(userId: string, limit: number = 5) {
  const db = getDatabase()
  try {
    // Subquery to find the latest chat timestamp for each agent used by the user
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

    // Main query to join the subquery results with the Agents table
    const recentAgents = await db
      .with(latestChatsSubquery)
      .select({
        id: Agents.id,
        name: Agents.name,
        image: Agents.image,
        lastUsedAt: latestChatsSubquery.lastUsedAt, // Include for ordering, might remove later if not needed in result
      })
      .from(Agents)
      .innerJoin(latestChatsSubquery, eq(Agents.id, latestChatsSubquery.agentId))
      .orderBy(desc(latestChatsSubquery.lastUsedAt))
      .limit(limit)

    // Optionally remove lastUsedAt if the final result shouldn't include it
    return recentAgents.map(({ id, name, image }) => ({ id, name, image }))
  } catch (error) {
    console.error(`Database error fetching recent agents for user ${userId}:`, error)
    throw new Error('Database query failed while fetching recent agents.')
  }
}
