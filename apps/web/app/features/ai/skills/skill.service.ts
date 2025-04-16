/**
 * Business logic for AgentSkill CRUD operations.
 * All database interaction for AgentSkills should be implemented here.
 */
import { getDatabase } from '@/db'
import { AgentSkills } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Create a new AgentSkill in the database.
 */
export async function createAgentSkill(data: typeof AgentSkills.$inferInsert) {
  const db = getDatabase()
  const [created] = await db.insert(AgentSkills).values(data).returning()
  return created
}

/**
 * Fetch a single AgentSkill by id.
 */
export async function getAgentSkillById(id: string) {
  const db = getDatabase()
  return db.query.AgentSkills.findFirst({ where: eq(AgentSkills.id, id) })
}

/**
 * Update an AgentSkill by id.
 */
export async function updateAgentSkillById(
  id: string,
  data: Partial<typeof AgentSkills.$inferInsert>,
) {
  const db = getDatabase()
  const [updated] = await db
    .update(AgentSkills)
    .set(data)
    .where(eq(AgentSkills.id, id))
    .returning()
  return updated
}

/**
 * Delete an AgentSkill by id.
 */
export async function deleteAgentSkillById(id: string) {
  const db = getDatabase()
  const [deleted] = await db.delete(AgentSkills).where(eq(AgentSkills.id, id)).returning()
  return !!deleted
}

/**
 * Fetch all AgentSkills for a given agentId.
 */
export async function getAgentSkillsByAgentId(agentId: string) {
  const db = getDatabase()
  return db.query.AgentSkills.findMany({ where: eq(AgentSkills.agentId, agentId) })
}
