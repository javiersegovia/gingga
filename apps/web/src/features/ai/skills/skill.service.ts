import { eq } from '@gingga/db'
import { AgentSkills } from '@gingga/db/schema'
/**
 * Business logic for AgentSkill CRUD operations.
 * All database interaction for AgentSkills should be implemented here.
 */
import { getDatabase } from '~/global-middleware'

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
 * Upsert an AgentSkill. Creates if id is not provided or doesn't exist,
 * otherwise updates the existing skill based on the id.
 */
export async function upsertAgentSkill(data: typeof AgentSkills.$inferInsert) {
  const db = getDatabase()
  const [result] = await db
    .insert(AgentSkills)
    .values(data)
    .onConflictDoUpdate({ target: AgentSkills.id, set: data })
    .returning()

  return result
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

/**
 * Updates the enabled status of a specific AgentSkill.
 */
export async function updateAgentSkillEnabledStatus(id: string, isEnabled: boolean) {
  const db = getDatabase()
  const [updated] = await db
    .update(AgentSkills)
    .set({ isEnabled, updatedAt: new Date() }) // Ensure updatedAt is also updated
    .where(eq(AgentSkills.id, id))
    .returning()
  return updated
}
