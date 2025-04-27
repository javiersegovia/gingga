import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '~/trpc'
import {
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
  getChatsByUserId,
  renameChatById,
  updateChatVisibilityById,
} from './chat.service'

export const chatRouter = router({
  getChatById: publicProcedure // Assuming public based on original lack of authMiddleware
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const chat = await getChatById({ id: input.id })
      if (!chat) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Chat not found' })
      }
      return chat
    }),

  getChatMessagesByChatId: publicProcedure // Assuming public
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const chatMessages = await getChatMessagesByChatId({ id: input.id })
      return chatMessages
    }),

  getUserChats: protectedProcedure
    .query(async ({ ctx }) => {
      const chats = await getChatsByUserId({ userId: ctx.user.id })
      return chats
    }),

  renameChat: protectedProcedure
    .input(RenameChatSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await renameChatById({
        chatId: input.id,
        title: input.title,
        userId: ctx.user.id,
      })
      return result
    }),

  deleteChat: protectedProcedure
    .input(DeleteChatSchema)
    .mutation(async ({ input }) => {
      await deleteChatById({ id: input.id })
      return { success: true }
    }),

  updateChatVisibility: protectedProcedure
    .input(UpdateChatVisibilitySchema)
    .mutation(async ({ input }) => {
      await updateChatVisibilityById({
        chatId: input.id,
        visibility: input.visibility,
      })
      return { id: input.id, visibility: input.visibility }
    }),

  deleteTrailingMessages: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const message = await getChatMessageById({ id: input.id })
      if (!message) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found' })
      }
      await deleteChatMessagesByChatIdAfterTimestamp({
        chatId: message.chatId,
        timestamp: message.createdAt,
      })
      return { success: true }
    }),
})

export type ChatRouter = typeof chatRouter
