import type { CoreAssistantMessage, CoreToolMessage, Message, UIMessage } from 'ai'
import type { z } from 'zod'
import type { ChatSchema } from '~/features/chat/chat.schema'
import { and, asc, desc, eq, gte, inArray, isNotNull } from '@gingga/db'
import { ChatMessages, Chats } from '@gingga/db/schema'
import { TRPCError } from '@trpc/server'
import { generateText } from 'ai'
import { modelProvider } from '~/lib/ai/providers'
import { getDB } from '~/server/context.server'

export async function saveChat({
  id,
  userId,
  title,
  agentId,
  durableObjectId,
}: z.infer<typeof ChatSchema>) {
  const db = getDB()
  try {
    const [newChat] = await db
      .insert(Chats)
      .values({
        id,
        userId,
        title,
        agentId,
        durableObjectId,
      })
      .returning({ id: Chats.id })

    return newChat
  }
  catch (error) {
    console.error('Failed to save chat in database')
    throw error
  }
}

export async function deleteChatById({ id }: { id: string }) {
  const db = getDB()
  try {
    await db.delete(ChatMessages).where(eq(ChatMessages.chatId, id))
    return await db.delete(Chats).where(eq(Chats.id, id))
  }
  catch (error) {
    console.error('Failed to delete chat by id from database')
    throw error
  }
}

// Renamed parameter from id to userId for clarity, service now needs userId explicitly
export async function getChatsByUserId({ userId }: { userId: string }) {
  const db = getDB() // Changed to getDB()
  try {
    // Use innerJoin to link Chats with ChatMessages
    // Select only the columns from the Chats table
    // Group by Chats fields to ensure each chat appears only once
    return await db
      .select({
        id: Chats.id,
        userId: Chats.userId,
        title: Chats.title,
        agentId: Chats.agentId,
        createdAt: Chats.createdAt,
        updatedAt: Chats.updatedAt,
        visibility: Chats.visibility,
      })
      .from(Chats)
      .innerJoin(ChatMessages, eq(Chats.id, ChatMessages.chatId))
      .where(and(eq(Chats.userId, userId), isNotNull(Chats.agentId)))
      .groupBy(
        Chats.id,
        Chats.userId,
        Chats.title,
        Chats.agentId,
        Chats.createdAt,
        Chats.updatedAt,
        Chats.visibility,
      )
      .orderBy(desc(Chats.createdAt))
  }
  catch (error) {
    console.error('Failed to get chats by user from database', error)
    throw error
  }
}

export async function getChatById({ id }: { id: string }) {
  const db = getDB()
  try {
    const selectedChat = await db.query.Chats.findFirst({
      where: eq(Chats.id, id),
      with: {
        messages: true,
      },
    })

    return selectedChat
  }
  catch (error) {
    console.error(`Failed to fetch chat with ID: ${id}`, error)
    throw new Error('Failed to fetch chat')
  }
}

export async function saveChatMessages({
  messages,
}: {
  messages: Array<typeof ChatMessages.$inferInsert>
}) {
  const db = getDB()
  try {
    return await db.insert(ChatMessages).values(messages).onConflictDoNothing()
  }
  catch (error) {
    console.error('Failed to save messages in database', error)
    throw error
  }
}

export async function upsertChatMessage(message: typeof ChatMessages.$inferInsert) {
  const db = getDB()
  try {
    return await db
      .insert(ChatMessages)
      .values(message)
      .onConflictDoUpdate({
        target: [ChatMessages.id],
        set: message,
      })
  }
  catch (error) {
    console.error('Failed to upsert message in database', error)
    throw error
  }
}

export async function updateChatMessageById({
  id,
  message,
}: {
  id: string
  message: Partial<typeof ChatMessages.$inferInsert>
}) {
  const db = getDB() // Changed to getDB()
  try {
    return await db.update(ChatMessages).set(message).where(eq(ChatMessages.id, id))
  }
  catch (error) {
    console.error('Failed to update message in database', error)
    throw error
  }
}

export async function getChatMessagesByChatId({ id }: { id: string }) {
  const db = getDB() // Changed to getDB()
  try {
    const messages = await db
      .select()
      .from(ChatMessages)
      .where(eq(ChatMessages.chatId, id))
      .orderBy(asc(ChatMessages.createdAt))

    return messages
  }
  catch (error) {
    console.error('Failed to get chat messages by chat id from database', error)
    throw error
  }
}

export async function getChatMessageById({ id }: { id: string }) {
  const db = getDB() // Changed to getDB()
  try {
    const [selectedChatMessage] = await db
      .select()
      .from(ChatMessages)
      .where(eq(ChatMessages.id, id))

    return selectedChatMessage
  }
  catch (error) {
    console.error('Failed to get chat message by id from database', error)
    throw error
  }
}

export async function deleteChatMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string
  timestamp: Date
}) {
  const db = getDB() // Changed to getDB()
  try {
    const messagesToDelete = await db
      .select({ id: ChatMessages.id })
      .from(ChatMessages)
      .where(and(eq(ChatMessages.chatId, chatId), gte(ChatMessages.createdAt, timestamp)))

    const messageIds = messagesToDelete.map(message => message.id)

    if (messageIds.length > 0) {
      // Commented out vote deletion as it's not present in the provided file
      // await db
      //   .delete(vote)
      //   .where(and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)))

      return await db
        .delete(ChatMessages)
        .where(and(eq(ChatMessages.chatId, chatId), inArray(ChatMessages.id, messageIds)))
    }
    // Return something explicit for the case where no messages are deleted
    return { count: 0 }
  }
  catch (error) {
    console.error('Failed to delete messages by id after timestamp from database')
    throw error
  }
}

export async function updateChatVisibilityById({ // Renamed function for clarity
  chatId,
  visibility,
}: {
  chatId: string
  visibility: 'private' | 'public'
}) {
  const db = getDB() // Changed to getDB()
  try {
    return await db.update(Chats).set({ visibility }).where(eq(Chats.id, chatId))
  }
  catch (error) {
    console.error('Failed to update chat visibility in database')
    throw error
  }
}

// Renamed function for clarity and updated parameter name
export async function renameChatById({ chatId, title, userId }: { chatId: string, title: string, userId: string }) {
  const db = getDB() // Changed to getDB()
  try {
    await db
      .update(Chats)
      .set({ title })
      .where(and(eq(Chats.id, chatId), eq(Chats.userId, userId)))
    // Consider returning the updated chat or a success status
    return { id: chatId, title }
  }
  catch (error) {
    console.error('Failed to rename chat in database', error)
    throw error
  }
}

export async function generateChatTitleFromUserMessage({
  message,
}: {
  message: Message
}) {
  const { text: title } = await generateText({
    model: modelProvider.languageModel('chat-title'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: JSON.stringify(message),
  })

  return title
}

// CHAT UTILS...

export function getMostRecentUserMessage(messages: Array<UIMessage>) {
  const userMessages = messages.filter(message => message.role === 'user')
  return userMessages.at(-1)
}

type ResponseMessageWithoutId = CoreToolMessage | CoreAssistantMessage
type ResponseMessage = ResponseMessageWithoutId & { id: string }

export function getTrailingMessageId({
  messages,
}: {
  messages: Array<ResponseMessage>
}): string | null {
  const trailingMessage = messages.at(-1)
  if (!trailingMessage)
    return null
  return trailingMessage.id
}

/**
 * Fetches chats for a specific agent and user, ordered by creation date descending.
 * @param agentId The ID of the agent.
 * @param userId The ID of the user.
 * @param limit Optional limit for the number of chats to return.
 * @returns An array of chats.
 */
export async function getChatsByAgentId(
  agentId: string,
  userId: string,
  limit?: number,
) {
  const db = getDB()
  try {
    const query = db.query.Chats.findMany({
      where: and(eq(Chats.agentId, agentId), eq(Chats.userId, userId)),
      orderBy: desc(Chats.createdAt),
      limit,
    })
    return await query
  }
  catch (error) {
    console.error(
      `Failed to fetch chats for agent ${agentId} and user ${userId}`,
      error,
    )
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch chat history for this agent',
      cause: error,
    })
  }
}
