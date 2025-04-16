import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { streamText, appendResponseMessages, createDataStreamResponse } from 'ai'
import { nanoid } from 'nanoid'
import {
  generateChatTitleFromUserMessage,
  getChatById,
  getMostRecentUserMessage,
  getTrailingMessageId,
  saveChat,
  saveChatMessages,
} from '@/features/chat/chat.service'
import { setupAppContext } from '@/middleware/setup-context.server'
import { modelProvider } from '@/features/ai/utils/providers'
import { getAgentById } from '@/features/agent/agent.service'
import { z } from 'zod'
import { processToolCalls } from '@/features/ai/utils/human-in-the-loop'
import { getVercelToolset } from '@/features/settings/integrations/composio.service'

export const APIRoute = createAPIFileRoute('/api/agents/custom/$agentId')({
  POST: async ({ request, params }) => {
    // This route is available for unauthenticated users, so no authentication check is enforced.
    const { authSession } = await setupAppContext()

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
    })

    const parsed = ChatSchema.safeParse(await request.json())
    if (!parsed.success) {
      return json({ result: parsed.error.message }, { status: 400 })
    }
    const { id, messages } = parsed.data

    const lastUserMessage = getMostRecentUserMessage(messages)
    if (!lastUserMessage) {
      return new Response('No user message found', { status: 400 })
    }

    const agentId = params.agentId
    const agentInfo = await getAgentById(agentId)
    if (!agentInfo) {
      return json({ result: `Agent with ID '${agentId}' not found.` }, { status: 404 })
    }
    const { instructions: agentInstructions, modelId: agentModelId } = agentInfo

    let chat: { id: string } | undefined = await getChatById({ id })
    if (!chat) {
      chat = await saveChat({
        id,
        userId: authSession && authSession.isAuthenticated ? authSession.user.id : null,
        title: await generateChatTitleFromUserMessage({ message: lastUserMessage }),
        agentId,
      })
    }

    // Save user message
    await saveChatMessages({
      messages: [
        {
          id: lastUserMessage.id,
          role: 'user',
          chatId: chat.id,
          parts: lastUserMessage.parts,
          attachments: lastUserMessage.experimental_attachments ?? [],
        },
      ],
    })

    if (!process.env.COMPOSIO_GMAIL_INTEGRATION_ID) {
      throw new Error('COMPOSIO_GMAIL_INTEGRATION_ID is not set')
    }

    const toolset = getVercelToolset({
      entityId: authSession?.isAuthenticated ? authSession.user.id : undefined,
    })
    const composioTools = await toolset.getTools({
      apps: ['GMAIL', 'GOOGLESHEETS', 'GOOGLECALENDAR'],
      integrationId: process.env.COMPOSIO_GOOGLESHEETS_INTEGRATION_ID,
      // actions: [''],
    })

    try {
      return createDataStreamResponse({
        execute: async (dataStream) => {
          const { proccesedMessages } = await processToolCalls({
            chatId: chat.id,
            dataStream,
            messages,
            tools: composioTools,
            executions: {},
          })

          const instructions = agentInstructions
            ? [
                {
                  role: 'system' as const,
                  content: `${agentInstructions}

                  ## TOOL CALLING INSTRUCTIONS

                  If you receive Composio errors during the execution of a tool related to the user's credentials, please ask the user to re-authenticate. For example, if the error says anything about not finding a connection, you should ask the user to go to their settings and setup their specific integration again.`,
                },
              ]
            : []

          const result = streamText({
            model: modelProvider.languageModel('chat-agent-tools'),

            // model: agentModelId
            //   ? openrouter(agentModelId)
            //   : modelProvider.languageModel('chat-agent'),

            abortSignal: request.signal,
            messages: [...instructions, ...proccesedMessages],
            tools: composioTools,
            // experimental_activeTools: [],
            experimental_generateMessageId: nanoid,
            maxSteps: 10,
            async onFinish({ response }) {
              console.log(`[Agent Chat ${chat.id}] ~~~~ STARTING ON FINISH ~~~~`)
              console.log(
                `[Agent Chat ${chat.id}] onFinish received response with ${response.messages.length} messages.`,
              )
              const assistantMessages = response.messages.filter(
                (m) => m.role === 'assistant',
              )
              console.log(
                `[Agent Chat ${chat.id}] Assistant messages in response:`,
                JSON.stringify(assistantMessages, null, 2),
              )
              try {
                const assistantId = getTrailingMessageId({
                  messages: assistantMessages,
                })

                if (!assistantId) {
                  console.error(
                    `[Agent Chat ${chat.id}] No assistant message ID found after streaming. Not saving.`,
                  )
                  return
                }
                console.log(
                  `[Agent Chat ${chat.id}] Found assistant message ID: ${assistantId}`,
                )

                const [, assistantMessage] = appendResponseMessages({
                  messages: [lastUserMessage], // Consider if more context needed
                  responseMessages: response.messages,
                })
                console.log(
                  `[Agent Chat ${chat.id}] Message prepared for saving:`,
                  JSON.stringify(assistantMessage, null, 2),
                )

                if (
                  assistantMessage?.role === 'assistant' &&
                  assistantMessage.parts &&
                  assistantMessage.id === assistantId // Sanity check ID
                ) {
                  console.log(
                    `[Agent Chat ${chat.id}] Attempting to save assistant message ${assistantId}...`,
                  )
                  await saveChatMessages({
                    messages: [
                      {
                        id: assistantId,
                        chatId: chat.id,
                        role: 'assistant',
                        parts: assistantMessage.parts ?? [],
                        attachments: assistantMessage.experimental_attachments ?? [],
                        modelId:
                          agentModelId ||
                          modelProvider.languageModel('chat-basic').modelId,
                      },
                    ],
                  })
                  console.log(
                    `[Agent Chat ${chat.id}] Successfully saved assistant message ${assistantId}.`,
                  )
                } else {
                  console.log(
                    `[Agent Chat ${chat.id}] No valid assistant message found in onFinish response or ID mismatch. Not saving. ID found: ${assistantId}, Message processed: ${JSON.stringify(assistantMessage)}`,
                  )
                }
              } catch (error) {
                console.error(
                  `Failed to save assistant message for chat ${chat.id}:`,
                  error,
                )
              }
            },
          })
          result.consumeStream()
          result.mergeIntoDataStream(dataStream)
        },
        onError(error) {
          console.error(`[1] Error during AI stream for agent ${agentId}:`, error)
          throw error
        },
      })
    } catch (error) {
      console.error(`[2] Error during AI stream for agent ${agentId}:`, error)

      return json({ result: 'Error during AI stream' }, { status: 500 })
    }
  },
})
