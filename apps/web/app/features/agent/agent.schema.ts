import { Agents } from '@gingga/db/schema'
import { z } from 'zod'
import { formOptions } from '@tanstack/react-form'

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  instructions: z.string(),
  modelId: z.enum(Agents.modelId.enumValues).nullable(),
  image: z.string().url().optional().nullable(),
})
export type AgentSchema = z.infer<typeof AgentSchema>

// export const AgentCreateSchema = AgentSchema.omit({ id: true })
// export type AgentCreateSchema = z.infer<typeof AgentCreateSchema>

// Schema specifically for the AgentForm component
export const AgentFormSchema = z.object({
  name: z.string().min(1, 'Agent name is required.'),
  description: z.string().nullable(),
  instructions: z.string().min(1, 'Instructions are required.'),
  modelId: z.enum(Agents.modelId.enumValues).nullable().optional(),
  image: z.string().url({ message: 'Please enter a valid URL.' }).nullable(),
})
export type AgentFormValues = z.infer<typeof AgentFormSchema>

export const agentFormOptions = formOptions({
  defaultValues: {
    name: '',
    description: null,
    instructions: '',
    modelId: null,
    image: null,
  } as AgentFormValues,
  validators: {
    onSubmit: AgentFormSchema,
  },
})

// Schema for the request body to the dynamic agent route
// Note: We removed agentId as it's now in the URL params
export const AgentChatRequestSchema = z.object({
  id: z.string(), // Chat ID
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
      parts: z.array(z.any()), // Consider refining 'any' if possible
      // Add experimental_attachments if needed based on your UIMessage type
      experimental_attachments: z.array(z.any()).optional(),
    }),
  ),
})

export type AgentChatRequest = z.infer<typeof AgentChatRequestSchema>
