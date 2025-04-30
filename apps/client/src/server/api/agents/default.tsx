import { appendResponseMessages, createDataStreamResponse, streamText } from 'ai'
import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { ApiChatSchema } from '~/features/chat/chat.schema'
import {
  generateChatTitleFromUserMessage,
  getChatById,
  getMostRecentUserMessage,
  getTrailingMessageId,
  saveChat,
  saveChatMessages,
} from '~/features/chat/chat.service'
import { processToolCalls } from '~/lib/ai/human-in-the-loop'
import { modelProvider } from '~/lib/ai/providers'
import { getAuthSession } from '~/server/context.server'

export const agentDefaultRoute = new Hono().post('/', async (c) => {
  try {
    const authSession = await getAuthSession()
    const parsed = ApiChatSchema.safeParse(await c.req.json())

    if (!parsed.success) {
      // Return a proper Response object for stream compatibility
      return new Response(parsed.error.message, { status: 400 })
    }
    // todo: add default agentId -> should use the main Gingga agent.
    const { messages, agentId: _, id } = parsed.data

    const lastUserMessage = getMostRecentUserMessage(messages)
    if (!lastUserMessage) {
      return new Response('No user message found', { status: 400 })
    }

    let chat: { id: string } | undefined = await getChatById({ id })
    const userId = (authSession.isAuthenticated && authSession.user.id) || null

    if (!chat && userId) {
      chat = await saveChat({
        id,
        userId,
        title: await generateChatTitleFromUserMessage({ message: lastUserMessage }),
        agentId: null,
      })
    }

    if (!chat) {
      return new Response('Failed to create or retrieve chat', { status: 500 })
    }

    await saveChatMessages({ messages: [{
      id: lastUserMessage.id,
      role: 'user',
      chatId: chat.id,
      parts: lastUserMessage.parts,
      attachments: lastUserMessage.experimental_attachments ?? [],
    }] })

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const { proccesedMessages } = await processToolCalls({
          chatId: chat.id,
          dataStream,
          messages,
          tools: {},
          executions: {},
        })

        const result = streamText({
          model: modelProvider.languageModel('chat-agent'),
          abortSignal: c.req.raw.signal,
          messages: proccesedMessages,
          tools: {},
          experimental_generateMessageId: nanoid,
          maxSteps: 10,
          async onFinish({ response }) {
            const assistantMessages = response.messages.filter(
              m => m.role === 'assistant',
            )

            try {
              const newAssistantMessageId = getTrailingMessageId({
                messages: assistantMessages,
              })

              if (!newAssistantMessageId) {
                return
              }
              const [, newAssistantMessage] = appendResponseMessages({
                messages: [lastUserMessage],
                responseMessages: response.messages,
              })

              if (
                newAssistantMessage?.role === 'assistant'
                && newAssistantMessage.parts
                && newAssistantMessage.id === newAssistantMessageId
              ) {
                await saveChatMessages({
                  messages: [{
                    id: newAssistantMessage.id,
                    role: 'assistant',
                    chatId: chat.id,
                    parts: newAssistantMessage.parts ?? [],
                    attachments: newAssistantMessage.experimental_attachments ?? [],
                    modelId: modelProvider.languageModel('chat-agent').modelId,
                  }],
                })
              }
            }
            catch (_error) {
              console.error('Failed to save new assistant chat message in onFinish:', _error)
            }
          },

          // experimental_transform: [
          //   smoothStream({
          //     delayInMs: 10,
          //     chunking: 'word',
          //   }),
          // ],
        })

        void result.consumeStream()
        result.mergeIntoDataStream(dataStream)
      },
      onError(error) {
        // console.error('Error in /api/chat/default:', error)
        throw error // Re-throw error to be caught by the outer try/catch
      },
    })
  }
  catch (err) {
    const message
      = err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Unknown server error'

    return c.json(
      { error: message },
      { status: 500, statusText: 'Internal Server Error' },
    )
  }
})
