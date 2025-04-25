import { Agents } from '@gingga/db/schema'
import { z } from 'zod'

// Core Agent Schema (for database interactions)
export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  instructions: z.string(),
  modelId: z.enum(Agents.modelId.enumValues).optional().nullable(),
  image: z.string().url().optional().nullable(),
  // Add other fields from Agents schema as needed (e.g., createdAt, updatedAt)
  // createdAt: z.date(),
  // updatedAt: z.date().nullable(),
  // userId: z.string().nullable(), // If agents are user-specific
})

// Input Schema for Creating an Agent
export const CreateAgentInputSchema = AgentSchema.omit({
  id: true,
  // omit other generated fields like createdAt, updatedAt
}).extend({
  // Fields required for creation but not part of the base AgentSchema
  // (if any)
  // userId: z.string(), // Example if userId is required on creation
})
export type CreateAgentInput = z.infer<typeof CreateAgentInputSchema>

// Input Schema for Updating an Agent
export const UpdateAgentInputSchema = AgentSchema.partial().extend({
  id: z.string(), // ID is required to know which agent to update
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
  description: z.string().nullable(),
  instructions: z.string().min(1, 'Instructions are required.'),
  modelId: z.enum(Agents.modelId.enumValues).nullable().optional(),
  image: z.string().url({ message: 'Please enter a valid URL.' }).nullable(),
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
