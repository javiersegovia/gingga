import { createServerFn } from '@tanstack/react-start'
import { googlesheetsSkill } from './googlesheets/data'
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
} from './skill.service'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'

export const $getSkillOptions = createServerFn({ method: 'GET' }).handler<SkillOption[]>(
  async () => {
    return [googlesheetsSkill()]
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
 */
export const $createSkill = createServerFn({ method: 'POST' })
  .validator(zodValidator(CreateSkillInputSchema))
  .handler(async ({ data }) => {
    return createAgentSkill(data)
  })

/**
 * Server function to update an AgentSkill by id.
 */
export const $updateSkillById = createServerFn({ method: 'POST' })
  .validator(zodValidator(UpdateSkillInputSchema))
  .handler(async ({ data }) => {
    const { id, ...updateData } = data
    return updateAgentSkillById(id, updateData)
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
