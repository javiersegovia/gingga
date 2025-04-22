import { and, eq } from '@gingga/db'
import { Chats } from '@gingga/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { getDatabase } from '~/global-middleware'
import { authMiddleware } from '~/middleware/auth-middleware'
import {
  ChatModelSchema,
  DeleteChatSchema,
  RenameChatSchema,
  UpdateChatVisibilitySchema,
} from './chat.schema'
import {
  deleteChatById,
  deleteChatMessagesByChatIdAfterTimestamp,
  getChatById,
  getChatMessageById,
  getChatMessagesByChatId,
  getChatModelFromCookies,
  getChatsByUserId,
  saveChatModelInCookies,
  updateChatVisiblityById,
} from './chat.service'

export const $getChatModelId = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(getChatModelFromCookies)

export const $saveChatModel = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .validator(zodValidator(ChatModelSchema))
  .handler(async ({ data }) => {
    saveChatModelInCookies(data.modelId)
    return { success: true }
  })

export const $getChatById = createServerFn({ method: 'GET' })
  .validator(
    zodValidator(
      z.object({
        id: z.string(),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const chat = await getChatById({ id: data.id })
    return chat
  })

const chatMessagesSchema = z.object({
  id: z.string(),
})

export const $getChatMessagesByChatId = createServerFn({ method: 'GET' })
  .validator(zodValidator(chatMessagesSchema))
  .handler(async ({ data }) => {
    const chatMessages = await getChatMessagesByChatId({ id: data.id })
    return chatMessages
  })

export const $getUserChats = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return getChatsByUserId({ id: context.user.id })
  })

export const $renameChat = createServerFn({ method: 'POST' })
  .validator(zodValidator(RenameChatSchema))
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const db = getDatabase()
    await db
      .update(Chats)
      .set({ title: data.title })
      .where(and(eq(Chats.id, data.id), eq(Chats.userId, context.user.id)))
    return data
  })

export const $deleteChat = createServerFn({ method: 'POST' })
  .validator(zodValidator(DeleteChatSchema))
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    await deleteChatById({ id: data.id })
    return { success: true }
  })

export const $updateChatVisibility = createServerFn({ method: 'POST' })
  .validator(zodValidator(UpdateChatVisibilitySchema))
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    await updateChatVisiblityById({
      chatId: data.id,
      visibility: data.visibility,
    })
    return data
  })

export const $deleteTrailingMessages = createServerFn({ method: 'POST' })
  .validator(
    zodValidator(
      z.object({
        id: z.string(),
      }),
    ),
  )
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const message = await getChatMessageById({ id: data.id })

    await deleteChatMessagesByChatIdAfterTimestamp({
      chatId: message.chatId,
      timestamp: message.createdAt,
    })
  })
