import { z } from 'zod'
import {
  ComposioAppNames,
  ComposioToolNameEnum,
} from '~/features/settings/integrations/composio.schema'
import { skillIds, toolNames } from './skill.types'

/**
 * Params schema for endpoints that require a skill ID.
 */
export const SkillIdParamSchema = z.object({
  id: z.string(),
})

/**
 * Input schema for creating a new AgentSkill.
 * All fields are required for creation.
 */
export const CreateSkillInputSchema = z.object({
  agentId: z.string(),
  skillId: z.enum(skillIds),

  name: z.string().optional(),
  description: z.string().optional(),

  composioIntegrationAppName: z.enum(ComposioAppNames).nullable().optional(),
  composioToolNames: z.array(ComposioToolNameEnum).default([]).nullable().optional(),
  variables: z.record(z.string(), z.string().nullable()).optional(),
  instructions: z.string().optional(),
  tools: z.array(z.enum(toolNames)).optional().nullable(),
  isEnabled: z.boolean().default(true),
  version: z.string().optional(),
})
export type CreateSkillInput = z.infer<typeof CreateSkillInputSchema>

/**
 * Input schema for updating an existing AgentSkill.
 * Extends the create schema but makes all fields optional except for 'id'.
 */
export const UpdateSkillInputSchema = CreateSkillInputSchema.partial().extend({
  id: z.string(), // 'id' remains required
})

/**
 * Input schema for deleting an AgentSkill.
 */
export const DeleteSkillInputSchema = z.object({
  id: z.string(),
})
