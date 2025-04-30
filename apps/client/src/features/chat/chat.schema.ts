import { z } from 'zod'

export const ChatSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  title: z.string(),
  visibility: z.enum(['public', 'private']).default('private').optional(),
  agentId: z.string().nullable(),
  durableObjectId: z.string().optional(),
})

export const ApiChatSchema = z.object({
  id: z.string(),
  agentId: z.string().optional(),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['user', 'assistant', 'system', 'data']),
      content: z.string(),
      parts: z.array(z.any()),
      experimental_attachments: z.array(z.any()).optional(),
    }),
  ),
})

export const RenameChatSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title cannot be empty'),
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
