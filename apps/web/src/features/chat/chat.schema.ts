import { z } from 'zod'
import { aiModels } from '../ai/utils/ai-models'

export const ChatSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  title: z.string(),
  visibility: z.enum(['public', 'private']).default('private').optional(),
  agentId: z.string().nullable(),
})

export const AIChatSchema = z.object({
  id: z.string(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
      parts: z.array(z.any()),
    }),
  ),
  agentId: z.string().optional(),
})

export const RenameChatSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(80, 'Title must be less than 80 characters'),
})

export const DeleteChatSchema = z.object({
  id: z.string(),
})

export const UpdateChatVisibilitySchema = z.object({
  id: z.string(),
  visibility: z.enum(['public', 'private']),
})

export type ChatType = z.infer<typeof ChatSchema>
export type RenameChatType = z.infer<typeof RenameChatSchema>
export type DeleteChatType = z.infer<typeof DeleteChatSchema>
export type UpdateChatVisibilityType = z.infer<typeof UpdateChatVisibilitySchema>

export const ChatModelSchema = z
  .object({ modelId: z.string() })
  .refine(data => aiModels.some(model => model.id === data.modelId), {
    message: 'Invalid model id',
  })
