import { z } from 'zod'
import { ComposioAppNames } from '@/features/settings/integrations/composio.schema'
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
  composioIntegrationAppName: z.enum(ComposioAppNames),
  composioToolNames: z.array(z.enum(toolNames)).default([]),
  variables: z.record(z.string(), z.string().nullable()),
  instructions: z.string(),
  tools: z.array(z.enum(toolNames)),
  isEnabled: z.boolean().default(true),
  version: z.string(),
})

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
