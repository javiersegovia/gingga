/* eslint-disable ts/no-unsafe-function-type */
import type { Message } from '@ai-sdk/ui-utils'
import type { DataStreamWriter, ToolExecutionOptions, ToolSet } from 'ai'
import type { z } from 'zod'
import type { ToolResponse } from '~/features/tools/tool.types'
import { formatDataStreamPart } from '@ai-sdk/ui-utils'
import { convertToCoreMessages } from 'ai'
import { upsertChatMessage } from '~/features/chat/chat.service'
import { APPROVAL } from '~/features/tools/tool.info'

function isValidToolName<K extends PropertyKey, T extends object>(
  key: K,
  obj: T,
): key is K & keyof T {
  return key in obj
}

interface ProcessToolCallsResult {
  updatedMessage: Pick<Message, 'id' | 'parts'> | null
  proccesedMessages: Message[]
}

/**
 * Processes tool invocations where human input is required, executing tools when authorized.
 *
 * @param options - The function options
 * @param options.chatId - The chat ID
 * @param options.tools - Map of tool names to Tool instances that may expose execute functions
 * @param options.dataStream - Data stream for sending results back to the client
 * @param options.messages - Array of messages to process
 * @param options.executions - Map of tool names to execute functions
 * @returns Promise resolving to the processed messages
 */
export async function processToolCalls<
  Tools extends ToolSet,
  ExecutableTools extends {
    [Tool in keyof Tools as Tools[Tool] extends { execute: Function }
      ? never
      : Tool]: Tools[Tool]
  },
>({
  chatId,
  dataStream,
  messages,
  executions,
}: {
  chatId: string
  tools: Tools // used for type inference
  dataStream: DataStreamWriter
  messages: Message[]
  executions: {
    [K in keyof Tools & keyof ExecutableTools]?: (
      args: z.infer<ExecutableTools[K]['parameters']>,
      context: ToolExecutionOptions,
    ) => Promise<ToolResponse>
  }
}): Promise<ProcessToolCallsResult> {
  const lastMessage = messages[messages.length - 1]
  const parts = lastMessage.parts
  if (!parts) {
    return { updatedMessage: null, proccesedMessages: messages }
  }

  // let updatedMessageId: Message['id'] | null = null
  let isUpdated: boolean = false
  // const updatedParts: ProcessToolCallsResult['updatedParts'] = []

  const processedParts = await Promise.all(
    parts.map(async (part) => {
      if (part.type !== 'tool-invocation') {
        return part
      }

      const { toolInvocation } = part
      const toolName = toolInvocation.toolName

      // Only continue if we have an execute function for the tool (meaning it requires confirmation) and it's in a 'result' state
      if (!isValidToolName(toolName, executions) || toolInvocation.state !== 'result') {
        return part
      }
      let result: ToolResponse

      if (toolInvocation.result?.output === APPROVAL.YES) {
        const toolExecution = executions[toolName]
        if (toolExecution) {
          result = await toolExecution(toolInvocation.args, {
            messages: convertToCoreMessages(messages),
            toolCallId: toolInvocation.toolCallId,
          })
        }
        else {
          result = {
            success: false,
            label: 'Sorry! I cannot execute that action.',
            error: 'No execute function found on tool',
            output: null,
          }
        }
      }
      else if (toolInvocation.result?.output === APPROVAL.NO) {
        result = {
          success: false,
          label: 'Aborted! I did not receive the proper authorization.',
          error: 'User denied access to tool execution',
          output: null,
        }
      }
      else {
        // For any unhandled responses, return the original part.
        return part
      }

      // Forward updated tool result to the client.
      dataStream.write(
        formatDataStreamPart('tool_result', {
          toolCallId: toolInvocation.toolCallId,
          result,
        }),
      )

      // TODO: we should update the message in the db too somewhere inside this func.

      isUpdated = true

      return {
        ...part,
        toolInvocation: {
          ...toolInvocation,
          result,
        },
      }
    }),
  )

  if (isUpdated) {
    await upsertChatMessage({
      chatId,
      id: lastMessage.id,
      role: 'assistant',
      parts: processedParts,
    })
  }

  // Finally return the processed messages
  return {
    updatedMessage: isUpdated ? { ...lastMessage, parts: processedParts } : null,
    proccesedMessages: [
      ...messages.slice(0, -1),
      { ...lastMessage, parts: processedParts },
    ],
  }
}
