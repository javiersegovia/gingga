import type { UIMessage } from 'ai'
import { appendResponseMessages, createDataStreamResponse, streamText } from 'ai'
import { Hono } from 'hono'
import { nanoid } from 'nanoid'
import { getAgentById } from '~/features/agent/agent.service'
import { ApiChatSchema } from '~/features/chat/chat.schema'
import {
  generateChatTitleFromUserMessage,
  getChatById,
  getMostRecentUserMessage,
  getTrailingMessageId,
  saveChat,
  upsertChatMessage,
} from '~/features/chat/chat.service'
import { processToolCalls } from '~/lib/ai/human-in-the-loop'
import { getAgentData } from '~/server/agents'
import { getAuthSession } from '~/server/context.server'

export const agentCustomRoute = new Hono().post('/:agentId', async (c) => {
  try {
    const authSession = await getAuthSession()
    const agentId = c.req.param('agentId')

    const parsed = ApiChatSchema.safeParse(await c.req.json())
    if (!parsed.success) {
      return new Response(parsed.error.message, { status: 400 })
    }
    const { id, messages } = parsed.data

    const lastUserMessage = getMostRecentUserMessage(messages as UIMessage[])
    if (!lastUserMessage) {
      return new Response('No user message found', { status: 400 })
    }

    const agent = await getAgentById(agentId)
    if (!agent) {
      return c.json({ result: `Agent with ID '${agentId}' not found.` }, { status: 404 })
    }

    let chat: { id: string } | undefined = await getChatById({ id })
    const userId = (authSession.isAuthenticated && authSession.user.id) || null
    if (!chat) {
      chat = await saveChat({
        id,
        userId,
        title: await generateChatTitleFromUserMessage({ message: lastUserMessage }),
        agentId,
      })
    }

    if (!chat) {
      return new Response('Failed to create or retrieve chat', { status: 500 })
    }

    await upsertChatMessage({
      id: lastUserMessage.id,
      role: 'user',
      chatId: chat.id,
      parts: lastUserMessage.parts,
      attachments: lastUserMessage.experimental_attachments ?? [],
    })

    const { instructions } = agent
    const { systemPrompt, model, tools } = getAgentData({ agentType: agent.agentType, agentId })

    const systemMessage = {
      role: 'system' as const,
      content: `${systemPrompt}
      ${instructions}`.trim(),
    }

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const { proccesedMessages } = await processToolCalls({
          chatId: chat.id,
          dataStream,
          messages,
          tools: tools ?? {},
          executions: {},
        })

        const result = streamText({
          model,

          abortSignal: c.req.raw.signal,
          messages: [systemMessage, ...proccesedMessages],

          tools: tools ?? {},
          experimental_generateMessageId: nanoid,
          maxSteps: 10,
          async onFinish({ response }) {
            const assistantMessages = response.messages.filter(
              m => m.role === 'assistant',
            )

            try {
              const assistantId = getTrailingMessageId({
                messages: assistantMessages,
              })

              if (!assistantId) {
                return
              }

              const [, newAssistantMessage] = appendResponseMessages({
                messages: [lastUserMessage],
                responseMessages: response.messages,
              })

              if (
                newAssistantMessage?.role === 'assistant'
                && newAssistantMessage.parts
                && newAssistantMessage.id === assistantId
              ) {
                await upsertChatMessage({
                  id: newAssistantMessage.id,
                  chatId: chat.id,
                  role: 'assistant',
                  parts: newAssistantMessage.parts ?? [],
                  attachments: newAssistantMessage.experimental_attachments ?? [],
                  modelId: model.modelId,
                })
              }
            }
            catch (_error) {
            }
          },
        })
        void result.consumeStream()
        result.mergeIntoDataStream(dataStream)
      },
      onError(error) {
        throw error
      },
    })
  }
  catch (err) {
    const agentId = c.req.param('agentId')
    console.error(`Error processing request for agent ${agentId}:`, err)

    const message
      = err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Unknown server error during agent processing'

    return c.json(
      { error: message },
      { status: 500, statusText: 'Internal Server Error' },
    )
  }
})
