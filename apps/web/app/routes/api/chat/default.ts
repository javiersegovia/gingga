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
import { AIChatSchema } from '../../../features/chat/chat.schema'

export const APIRoute = createAPIFileRoute('/api/chat/default')({
  POST: async ({ request }) => {
    try {
      const { authSession } = await setupAppContext()

      const parsed = AIChatSchema.safeParse(await request.json())

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

      // Removed the specific try-catch here. Let errors bubble up before streaming.
      // If this fails, the main try-catch at the bottom will handle it.
      await upsertChatMessage({
        id: lastUserMessage.id,
        role: 'user',
        chatId: chat.id,
        parts: lastUserMessage.parts,
        attachments: lastUserMessage.experimental_attachments ?? [],
      })

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
              console.log(
                `[Chat ${chat.id}] onFinish received response with ${response.messages.length} messages.`,
              )
              // Detailed log of assistant messages received
              const assistantMessages = response.messages.filter(
                (m) => m.role === 'assistant',
              )
              console.log(
                `[Chat ${chat.id}] Assistant messages in response:`,
                JSON.stringify(assistantMessages, null, 2), // Log structure
              )

              try {
                const newAssistantMessageId = getTrailingMessageId({
                  messages: assistantMessages, // Use filtered list
                })

                if (!newAssistantMessageId) {
                  console.error(
                    `[Chat ${chat.id}] No assistant message ID found after streaming. Not saving.`,
                  )
                  return
                }
                console.log(
                  `[Chat ${chat.id}] Found assistant message ID: ${newAssistantMessageId}`,
                )

                const [, newAssistantMessage] = appendResponseMessages({
                  // Consider if passing more history is needed by appendResponseMessages
                  messages: [lastUserMessage],
                  responseMessages: response.messages,
                })

                console.log(
                  `[Chat ${chat.id}] Message prepared for saving:`,
                  JSON.stringify(newAssistantMessage, null, 2),
                )

                if (
                  newAssistantMessage?.role === 'assistant' &&
                  newAssistantMessage.parts &&
                  newAssistantMessage.id === newAssistantMessageId // Sanity check ID
                ) {
                  console.log(
                    `[Chat ${chat.id}] Attempting to save assistant message ${newAssistantMessage.id}...`,
                  )
                  await upsertChatMessage({
                    id: newAssistantMessage.id,
                    chatId: chat.id,
                    role: 'assistant',
                    parts: newAssistantMessage.parts ?? [],
                    attachments: newAssistantMessage.experimental_attachments ?? [],
                    modelId: modelProvider.languageModel('chat-agent').modelId,
                  })
                  console.log(
                    `[Chat ${chat.id}] Successfully saved assistant message ${newAssistantMessage.id}.`,
                  )
                } else {
                  console.log(
                    `[Chat ${chat.id}] No valid assistant message found in onFinish response or ID mismatch. Not saving. ID found: ${newAssistantMessageId}, Message processed: ${JSON.stringify(newAssistantMessage)}`,
                  )
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
