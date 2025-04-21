import type { Tool } from 'ai'
import type { SkillInstruction } from '~/features/ai/utils/compose-system-message'
import type {
  ComposioAppName,
  ComposioToolName,
} from '~/features/settings/integrations/composio.schema'
import { json } from '@tanstack/react-start'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { appendResponseMessages, createDataStreamResponse, streamText } from 'ai'
import { nanoid } from 'nanoid'
import { getAgentById } from '~/features/agent/agent.service'
import { getSystemPrompt } from '~/features/ai/utils/compose-system-message'
import { processToolCalls } from '~/features/ai/utils/human-in-the-loop'
import { modelProvider } from '~/features/ai/utils/providers'
import { AIChatSchema } from '~/features/chat/chat.schema'
import {
  generateChatTitleFromUserMessage,
  getChatById,
  getMostRecentUserMessage,
  getTrailingMessageId,
  saveChat,
  upsertChatMessage,
} from '~/features/chat/chat.service'
import { getVercelToolset } from '~/features/settings/integrations/composio.service'
import { setupAppContext } from '~/middleware/setup-context.server'

export const APIRoute = createAPIFileRoute('/api/agents/custom/$agentId')({
  POST: async ({ request, params: { agentId } }) => {
    const { authSession } = await setupAppContext()

    const parsed = AIChatSchema.safeParse(await request.json())
    if (!parsed.success) {
      return json({ result: parsed.error.message }, { status: 400 })
    }
    const { id, messages } = parsed.data

    const lastUserMessage = getMostRecentUserMessage(messages)
    if (!lastUserMessage) {
      return new Response('No user message found', { status: 400 })
    }

    const agent = await getAgentById(agentId)
    if (!agent) {
      return json({ result: `Agent with ID '${agentId}' not found.` }, { status: 404 })
    }
    const { instructions: agentInstructions, modelId: agentModelId, agentSkills } = agent

    let chat: { id: string } | undefined = await getChatById({ id })
    if (!chat) {
      chat = await saveChat({
        id,
        userId: authSession && authSession.isAuthenticated ? authSession.user.id : null,
        title: await generateChatTitleFromUserMessage({ message: lastUserMessage }),
        agentId,
      })
    }

    await upsertChatMessage({
      id: lastUserMessage.id,
      role: 'user',
      chatId: chat.id,
      parts: lastUserMessage.parts,
      attachments: lastUserMessage.experimental_attachments ?? [],
    })

    const userId = authSession?.isAuthenticated ? authSession.user.id : undefined

    // console.log('[!!! - User ID]:', userId)

    const toolset = getVercelToolset({
      entityId: userId,
    })
    const appToolsMap = new Map<ComposioAppName, Set<ComposioToolName>>()
    const skillInstructions: SkillInstruction[] = []

    for (const skill of agentSkills) {
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
      toolNames.forEach(toolName => currentToolSet.add(toolName))
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
      entityId: authSession?.isAuthenticated ? authSession.user.id : undefined,
      appUniqueKeys: uniqueAppNames,
      showActiveOnly: true,
      showDisabled: false,
    })

    // // Extract active app unique IDs
    const activeAppIds = new Set(
      connections.items
        .filter(conn => conn.status === 'ACTIVE')
        .map(conn => conn.appUniqueId),
    )

    // // Fetch tools concurrently for each app
    const toolPromises = uniqueAppNames.map(async (appName) => {
      const toolNamesSet = appToolsMap.get(appName)
      if (!toolNamesSet)
        return {} // Should not happen, but safeguard

      const toolNamesArray = Array.from(toolNamesSet)

      try {
        const tools = await toolset.getTools({
          apps: [appName],
          actions: toolNamesArray,
        })
        return tools
      }
      catch (_error) {
        // console.error(`Error fetching tools for ${appName}:`, error)
        return {} // Return empty object on error to avoid breaking Promise.all
      }
    })

    const toolsResults = await Promise.all(toolPromises)

    // // Merge the results into a single object
    const composioTools: Record<string, Tool> = toolsResults.reduce(
      (acc, tools) => ({ ...acc, ...tools }),
      {},
    )

    // // Filter tools to include only those associated with active connections
    const activeTools = Object.entries(composioTools)
      .filter(([toolKey]) => {
        // Extract appName from the toolKey (e.g., 'googlesheets_create_spreadsheet')
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

    // console.log('System Message:', systemMessage)

    try {
      return createDataStreamResponse({
        execute: async (dataStream) => {
          const { proccesedMessages } = await processToolCalls({
            chatId: chat.id,
            dataStream,
            messages,
            tools: activeTools,
            executions: {},
          })

          const result = streamText({
            model: modelProvider.languageModel('chat-agent-tools'),

            // TODO: Later on we will enable this. For now, let's use the default model.
            // model: agentModelId
            //   ? openrouter(agentModelId)
            //   : modelProvider.languageModel('chat-agent'),

            abortSignal: request.signal,
            messages: [systemMessage, ...proccesedMessages], // Use the composed system message
            // messages: [...proccesedMessages], // Use the composed system message

            tools: activeTools, // Still pass all fetched tools
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
                  messages: [lastUserMessage], // Consider if more context needed
                  responseMessages: response.messages,
                })

                if (
                  newAssistantMessage?.role === 'assistant'
                  && newAssistantMessage.parts
                  && newAssistantMessage.id === assistantId // Sanity check ID
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
                // console.error(
                //   `Failed to save assistant message for chat ${chat.id}:`,
                //   error,
                // )
              }
            },
          })
          result.consumeStream()
          result.mergeIntoDataStream(dataStream)
        },
        onError(error) {
          // console.error(`[1] Error during AI stream for agent ${agentId}:`, error)
          throw error
        },
      })
    }
    catch (_error) {
      // console.error(`[2] Error during AI stream for agent ${agentId}:`, error)

      return json({ result: 'Error during AI stream' }, { status: 500 })
    }
  },
})
