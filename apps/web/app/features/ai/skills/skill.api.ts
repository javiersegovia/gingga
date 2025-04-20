import { createServerFn } from '@tanstack/react-start'
import { SkillId } from './skill.types'
import type { SkillOption } from './skill.types'
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
import {
  getComposioIntegrations,
  getUserComposioConnections,
} from '../../settings/integrations/composio.service'
import { authMiddleware } from '../../../middleware/auth-guard'
import type {
  ComposioAppName,
  ComposioIntegration,
  UserConnection,
} from '@/features/settings/integrations/composio.schema'
import type { InferSelectModel } from 'drizzle-orm'

// Define schema for upsert, making id optional
const UpsertSkillInputSchema = CreateSkillInputSchema.extend({
  id: z.string().optional(),
})

// Schema for updating only the enabled status
const UpdateSkillEnabledStatusSchema = z.object({
  id: z.string(),
  isEnabled: z.boolean(),
})

// Define the extended skill type for the API response
// Use InferSelectModel to get the correct type from the Drizzle schema object
// Define base type separately
type AgentSkillBaseType = InferSelectModel<typeof AgentSkills>
export type AgentSkillWithStatus = AgentSkillBaseType & {
  isConnected: boolean | null // Use null when not applicable
  isEnabledComposio: boolean | null // Represents Composio connection enabled status
  isDeletedComposio: boolean | null // Represents Composio connection deleted status
  skillOption?: SkillOption // Add the skill option for easy access
}

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
    return upsertAgentSkill(data)
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
 * Server function to fetch all AgentSkills for a given agentId, augmented with connection status.
 */
export const $getSkillsByAgentId = createServerFn({ method: 'GET' })
  .validator(zodValidator(z.object({ agentId: z.string() })))
  .middleware([authMiddleware])
  .handler(async ({ data, context }): Promise<AgentSkillWithStatus[]> => {
    const [agentSkills, composioConnections, composioIntegrations] = await Promise.all([
      getAgentSkillsByAgentId(data.agentId),
      getUserComposioConnections(context.auth.session.userId),
      getComposioIntegrations(),
    ])

    const composioConnectionsMap = new Map<ComposioAppName, UserConnection>(
      composioConnections.map((conn) => [conn.appName as ComposioAppName, conn]),
    )
    const composioIntegrationsMap = new Map<ComposioAppName, ComposioIntegration>(
      composioIntegrations.map((integration) => [
        integration.appName as ComposioAppName,
        integration,
      ]),
    )
    const skillOptionsMap = new Map<SkillId, SkillOption>(
      getSkills().map((opt) => [opt.id, opt]),
    )

    return agentSkills.map((skill) => {
      const skillOption = skillOptionsMap.get(skill.skillId)
      const integration = skillOption?.integration

      let isConnected: boolean | null = null
      let isEnabledComposio: boolean | null = null
      let isDeletedComposio: boolean | null = null

      if (integration?.required && integration.appName) {
        const relevantConnection = composioConnectionsMap.get(integration.appName)
        const relevantIntegration = composioIntegrationsMap.get(integration.appName)

        isConnected = relevantConnection ? relevantConnection.status === 'ACTIVE' : null
        isEnabledComposio = relevantIntegration ? !!relevantIntegration.enabled : null
        isDeletedComposio = relevantIntegration ? !!relevantIntegration.deleted : null
      }

      return {
        ...skill,
        skillOption,
        isConnected,
        isEnabledComposio,
        isDeletedComposio,
      }
    })
  })
