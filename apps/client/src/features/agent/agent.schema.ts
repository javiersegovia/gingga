import { Agents } from '@gingga/db/schema'
import { z } from 'zod'

// Core Agent Schema (for database interactions)
export const AgentSchema = z.object({
  id: z.string(),
  ownerId: z.string().nullable(),
  agentType: z.enum(Agents.agentType.enumValues),
  title: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  introduction: z.string().nullable(),
  instructions: z.string(),
  starters: z.array(z.string()).nullable(),
  modelId: z.enum(Agents.modelId.enumValues).nullable(),
  image: z.string().url().nullable(),
  createdAt: z.number(),
  updatedAt: z.number().nullable(),
})

// Input Schema for Creating an Agent
export const CreateAgentInputSchema = AgentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
}).extend({
  name: z.string().min(1),
  instructions: z.string().min(1),
  agentType: z.enum(Agents.agentType.enumValues),
  starters: z.array(z.string()).default([]).optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  introduction: z.string().optional().nullable(),
  modelId: z.enum(Agents.modelId.enumValues).optional().nullable(),
  image: z.string().url().optional().nullable().nullable(),
})
export type CreateAgentInput = z.infer<typeof CreateAgentInputSchema>

// Input Schema for Updating an Agent
export const UpdateAgentInputSchema = AgentSchema.omit({
  createdAt: true,
  updatedAt: true,
  ownerId: true,
})
  .partial()
  .extend({
    id: z.string(),
    starters: z.array(z.string()).default([]).optional().nullable(),
  })
export type UpdateAgentInput = z.infer<typeof UpdateAgentInputSchema>

// Input Schema for Get/Delete Agent by ID
export const AgentIdInputSchema = z.object({
  id: z.string(),
})
export type AgentIdInput = z.infer<typeof AgentIdInputSchema>

// Schema specifically for the AgentForm component
export const AgentFormSchema = z.object({
  name: z.string().min(1, 'Agent name is required.'),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  introduction: z.string().nullable().optional(),
  instructions: z.string().min(1, 'Instructions are required.'),
  starters: z.array(z.string()).max(5, 'Maximum of 5 starters allowed.').default([]).optional().nullable(),
  modelId: z.enum(Agents.modelId.enumValues).nullable().optional(),
  image: z.string().url({ message: 'Please enter a valid URL.' }).nullable().optional(),
  agentType: z.enum(Agents.agentType.enumValues, {
    errorMap: () => ({ message: 'Please select an agent type.' }),
  }),
})
export type AgentFormValues = z.infer<typeof AgentFormSchema>

// Schema for the request body to the dynamic agent route
// Note: We removed agentId as it's now in the URL params
export const AgentChatRequestSchema = z.object({
  id: z.string(), // Chat ID
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
      parts: z.array(z.any()).optional(), // Maintain compatibility if needed
      experimental_attachments: z.array(z.any()).optional(),
    }),
  ),
})

export type AgentChatRequest = z.infer<typeof AgentChatRequestSchema>
