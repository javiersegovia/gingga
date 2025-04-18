import { createServerFn } from '@tanstack/react-start'
import { SkillOption } from './skill.types'
import {
  SkillIdParamSchema,
  CreateSkillInputSchema,
  UpdateSkillInputSchema,
  DeleteSkillInputSchema,
} from './skill.schema'
import {
  createAgentSkill,
  getAgentSkillById,
  updateAgentSkillById,
  deleteAgentSkillById,
  getAgentSkillsByAgentId,
  upsertAgentSkill,
  updateAgentSkillEnabledStatus,
} from './skill.service'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { getSkills } from './skill.list'
import { AgentSkills } from '@/db/schema'

// Define schema for upsert, making id optional
const UpsertSkillInputSchema = CreateSkillInputSchema.extend({
  id: z.string().optional(),
})

// Schema for updating only the enabled status
const UpdateSkillEnabledStatusSchema = z.object({
  id: z.string(),
  isEnabled: z.boolean(),
})

export const $getSkillOptions = createServerFn({ method: 'GET' }).handler<SkillOption[]>(
  async () => {
    return getSkills()
  },
)

/**
 * Server function to fetch a single AgentSkill by id.
 */
export const $getSkillById = createServerFn({ method: 'GET' })
  .validator(zodValidator(SkillIdParamSchema))
  .handler(async ({ data }) => {
    return getAgentSkillById(data.id)
  })

/**
 * Server function to create a new AgentSkill.
 * @deprecated Use $upsertSkill instead
 */
export const $createSkill = createServerFn({ method: 'POST' })
  .validator(zodValidator(CreateSkillInputSchema))
  .handler(async ({ data }) => {
    return createAgentSkill(data)
  })

/**
 * Server function to update an AgentSkill by id.
 * @deprecated Use $upsertSkill instead
 */
export const $updateSkillById = createServerFn({ method: 'POST' })
  .validator(zodValidator(UpdateSkillInputSchema))
  .handler(async ({ data }) => {
    const { id, ...updateData } = data
    return updateAgentSkillById(id, updateData)
  })

/**
 * Server function to upsert (create or update) an AgentSkill.
 */
export const $upsertSkill = createServerFn({ method: 'POST' })
  .validator(zodValidator(UpsertSkillInputSchema))
  .handler(async ({ data }) => {
    // The id might be undefined for creation, which is handled by the service
    return upsertAgentSkill(data as typeof AgentSkills.$inferInsert)
  })

/**
 * Server function to update the enabled status of an AgentSkill.
 */
export const $updateSkillEnabledStatus = createServerFn({ method: 'POST' })
  .validator(zodValidator(UpdateSkillEnabledStatusSchema))
  .handler(async ({ data }) => {
    return updateAgentSkillEnabledStatus(data.id, data.isEnabled)
  })

/**
 * Server function to delete an AgentSkill by id.
 */
export const $deleteSkillById = createServerFn({ method: 'POST' })
  .validator(zodValidator(DeleteSkillInputSchema))
  .handler(async ({ data }) => {
    return deleteAgentSkillById(data.id)
  })

/**
 * Server function to fetch all AgentSkills for a given agentId.
 */
export const $getSkillsByAgentId = createServerFn({ method: 'GET' })
  .validator(zodValidator(z.object({ agentId: z.string() })))
  .handler(async ({ data }) => {
    return getAgentSkillsByAgentId(data.agentId)
  })
