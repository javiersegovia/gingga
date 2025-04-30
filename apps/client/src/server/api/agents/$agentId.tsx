import type { Tool, UIMessage } from 'ai'
import type {
  ComposioAppName,
  ComposioToolName,
} from '~/features/composio/composio.schema'
import type { SkillInstruction } from '~/lib/ai/compose-system-message'
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
import { getVercelToolset } from '~/features/composio/composio.service'
import { getSystemPrompt } from '~/lib/ai/compose-system-message'
import { processToolCalls } from '~/lib/ai/human-in-the-loop'
import { modelProvider } from '~/lib/ai/providers'
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
    const { instructions: agentInstructions, modelId: agentModelId, agentSkills } = agent

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

    const toolset = getVercelToolset({
      entityId: userId ?? undefined,
    })
    const appToolsMap = new Map<ComposioAppName, Set<ComposioToolName>>()
    const skillInstructions: SkillInstruction[] = []

    for (const skill of agentSkills ?? []) {
      if (
        !skill.isEnabled
        || !skill.composioIntegrationAppName
        || !skill.composioToolNames
      ) {
        continue
      }

      const appName = skill.composioIntegrationAppName
      const toolNames = skill.composioToolNames

      const currentToolSet = appToolsMap.get(appName) ?? new Set<ComposioToolName>()

      if (toolNames instanceof Set) {
        toolNames.forEach(toolName => currentToolSet.add(toolName))
      }
      else if (Array.isArray(toolNames)) {
        toolNames.forEach((toolName: ComposioToolName) => currentToolSet.add(toolName))
      }
      appToolsMap.set(appName, currentToolSet)

      if (skill.instructions) {
        skillInstructions.push({
          skillName: skill.name ?? skill.skillId,
          instructions: skill.instructions,
          appName,
          toolNames,
        })
      }
    }

    const uniqueAppNames = Array.from(appToolsMap.keys())
    const connections = await toolset.client.connectedAccounts.list({
      entityId: userId ?? undefined,
      appUniqueKeys: uniqueAppNames,
      showActiveOnly: true,
      showDisabled: false,
    })

    const activeAppIds = new Set(
      connections.items
        .filter(conn => conn.status === 'ACTIVE')
        .map(conn => conn.appUniqueId),
    )

    const toolPromises = uniqueAppNames.map(async (appName) => {
      const toolNamesSet = appToolsMap.get(appName)
      if (!toolNamesSet)
        return {}

      const toolNamesArray = Array.from(toolNamesSet)

      try {
        const tools = await toolset.getTools({
          apps: [appName],
          actions: toolNamesArray,
        })
        return tools
      }
      catch (_error) {
        return {}
      }
    })

    const toolsResults = await Promise.all(toolPromises)

    const composioTools: Record<string, Tool> = toolsResults.reduce(
      (acc, tools) => ({ ...acc, ...tools }),
      {},
    )

    const activeTools = Object.entries(composioTools)
      .filter(([toolKey]) => {
        const appName = toolKey.split('_')[0]
        return activeAppIds.has(appName)
      })
      .reduce(
        (acc, [key, tool]) => {
          acc[key] = tool
          return acc
        },
        {} as Record<string, Tool>,
      )

    const systemMessage = {
      role: 'system' as const,
      content: getSystemPrompt({
        agentName: agent.name,
        agentInstructions,
        skillInstructions,
        tools: Object.keys(activeTools),
        languagePref: 'English',
      }),
    }

    return createDataStreamResponse({
      execute: async (dataStream) => {
        const { proccesedMessages } = await processToolCalls({
          chatId: chat.id,
          dataStream,
          messages,
          tools: {},
          // tools: activeTools,
          executions: {},
        })

        const result = streamText({
          model: modelProvider.languageModel('chat-agent-tools'),

          abortSignal: c.req.raw.signal,
          messages: [systemMessage, ...proccesedMessages],

          // tools: activeTools,
          tools: {},
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
                  modelId:
                    agentModelId
                    || modelProvider.languageModel('chat-agent-tools').modelId,
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
