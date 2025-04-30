/* eslint-disable ts/no-empty-object-type */
import type { StreamTextOnFinishCallback } from 'ai'
import { AsyncLocalStorage } from 'node:async_hooks'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { AIChatAgent } from 'agents/ai-chat-agent'
import { createDataStreamResponse, streamText } from 'ai'
import { env } from 'cloudflare:workers'

export const agentContext = new AsyncLocalStorage<DefaultChatAgent>()

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
  baseURL: env.GATEWAY_BASE_OPENROUTER_URL,
})
const model = openrouter('google/gemini-2.5-flash-preview')

interface DefaultChatAgentState {
  chatId: string | null
}

export class DefaultChatAgent extends AIChatAgent<Env, DefaultChatAgentState> {
  initialState: DefaultChatAgentState = {
    chatId: null,
  }

  // private async ensureChatExists(): Promise<void> {
  //   if (this.state.chatId)
  //     return

  //   const authSession = await getAuthSession()
  //   const userId = (authSession.isAuthenticated && authSession.user.id) || null
  //   if (!userId)
  //     return

  //   const lastUserMessage = getMostRecentUserMessage(this.messages as UIMessage[])
  //   if (!lastUserMessage || !this.name)
  //     return

  //   try {
  //     const newChat = await saveChat({
  //       id: nanoid(),
  //       userId,
  //       title: await generateChatTitleFromUserMessage({
  //         message: lastUserMessage,
  //       }),
  //       agentId: null,
  //       durableObjectId: this.name,
  //     })

  //     this.setState({ chatId: newChat.id })
  //   }
  //   catch (error) {
  //     console.error(`Agent ${this.state.chatId}: Failed to save chat:`, error)
  //     throw new Error(`Failed to initialize chat ${this.state.chatId}`)
  //   }
  // }

  async onChatMessage(onFinish: StreamTextOnFinishCallback<{}>) {
    return agentContext.run(this, async () => {
      const dataStreamResponse = createDataStreamResponse({
        execute: async (dataStream) => {
          const result = streamText({
            model,
            messages: this.messages,
            onFinish,
          })

          void result.consumeStream(dataStream)
          result.mergeIntoDataStream(dataStream)
        },
      })

      return dataStreamResponse
    })
  }
}
