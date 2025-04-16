import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { streamText, appendResponseMessages, createDataStreamResponse } from 'ai'
import { z } from 'zod'
import {
  generateChatTitleFromUserMessage,
  getChatById,
  getMostRecentUserMessage,
  getTrailingMessageId,
  saveChat,
  upsertChatMessage,
} from '@/features/chat/chat.service'
import { setupAppContext } from '@/middleware/setup-context.server'
import { modelProvider } from '@/features/ai/utils/providers'
// import { tools, executions } from '@/features/ai/skills/index'
import { processToolCalls } from '@/features/ai/utils/human-in-the-loop'
import { nanoid } from 'nanoid'

const ChatSchema = z.object({
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

export const APIRoute = createAPIFileRoute('/api/chat/default')({
  POST: async ({ request }) => {
    try {
      const { authSession } = await setupAppContext()

      const parsed = ChatSchema.safeParse(await request.json())

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
      if (!chat) {
        chat = await saveChat({
          id,
          userId: authSession.isAuthenticated ? authSession.user.id : null,
          title: await generateChatTitleFromUserMessage({ message: lastUserMessage }),
          agentId: null,
        })
      }
      // Ensure chat exists before proceeding (saveChat should guarantee this, but belts and suspenders)
      if (!chat) {
        return new Response('Failed to create or retrieve chat', { status: 500 })
      }

      try {
        await upsertChatMessage({
          id: lastUserMessage.id,
          role: 'user',
          chatId: chat.id,
          parts: lastUserMessage.parts,
          attachments: lastUserMessage.experimental_attachments ?? [],
        })
      } catch (error) {
        console.error('Failed to save user message:', error)
      }

      return createDataStreamResponse({
        execute: async (dataStream) => {
          const { proccesedMessages } = await processToolCalls({
            chatId: chat.id,
            dataStream,
            messages,
            tools: {},
            executions: {},
          })

          // Now call the LLM with the potentially modified messages
          const result = streamText({
            model: modelProvider.languageModel('chat-agent'),
            abortSignal: request.signal,
            messages: proccesedMessages,
            tools: {},
            experimental_generateMessageId: nanoid,
            maxSteps: 10, // Consider if maxSteps is appropriate here
            async onFinish({ response }) {
              console.log('~~~~ STARTING ON FINISH ~~~~')
              try {
                const newAssistantMessageId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                })

                if (!newAssistantMessageId) {
                  console.error('No assistant message ID found after streaming.')
                  // Decide how to handle this - maybe don't save?
                  return
                  // throw new Error('No assistant message found!') // Avoid throwing here unless necessary
                }

                const [, newAssistantMessage] = appendResponseMessages({
                  messages: [lastUserMessage], // Pass only the last user message? Check SDK docs
                  responseMessages: response.messages,
                })

                if (
                  newAssistantMessage?.role === 'assistant' &&
                  newAssistantMessage.parts
                ) {
                  await upsertChatMessage({
                    id: newAssistantMessage.id,
                    chatId: chat.id,
                    role: 'assistant',
                    parts: newAssistantMessage.parts ?? [],
                    attachments: newAssistantMessage.experimental_attachments ?? [],
                    modelId: modelProvider.languageModel('chat-agent').modelId,
                  })
                } else {
                  console.log('No new assistant message found in onFinish response.')
                }
              } catch (error) {
                console.error(
                  'Failed to save new assistant chat message in onFinish:',
                  error,
                )
              }
            },

            // experimental_transform: [
            //   smoothStream({
            //     delayInMs: 10,
            //     chunking: 'word',
            //   }),
            // ],
          })

          result.consumeStream()
          result.mergeIntoDataStream(dataStream)
        },
        onError(error) {
          console.error('Error in /api/chat/default:', error)
          throw error
        },
      })
    } catch (err) {
      console.error('Error in /api/agents/gingga:', err) // Log the full error server-side
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Unknown server error'

      // Return a JSON response for non-streaming errors
      // Note: The client (useChat) might expect a stream or specific error format.
      // Check AI SDK docs for best practices on returning errors from API routes.
      // Returning JSON might be okay if the stream hasn't started.
      return json(
        { error: message },
        { status: 500, statusText: 'Internal Server Error' },
      )
    }
  },
})
