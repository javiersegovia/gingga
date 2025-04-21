import type { ChatMessage } from '@gingga/db/types'
import type { Attachment, UIMessage } from 'ai'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { $getChatById } from '~/features/chat/chat.api'
import { BaseChat } from '~/features/chat/components/base-chat'

function convertToUIMessages(messages: Array<ChatMessage>): Array<UIMessage> {
  return messages.map(message => ({
    id: message.id,
    parts: message.parts as UIMessage['parts'],
    role: message.role,
    createdAt: message.createdAt,
    content: '',
    experimental_attachments: (message.attachments as Array<Attachment>) ?? [],
  }))
}

export const Route = createFileRoute('/_demo/chat/agent/$agentId_/chat/$chatId')({
  component: AgentChatIdRoute,
  loader: async ({ params }) => {
    const chat = await $getChatById({ data: { id: params.chatId } })

    if (!chat) {
      throw redirect({ to: '/chat/agent/$agentId', params: { agentId: params.agentId } })
    }

    return { chat, agentId: params.agentId }
  },
  staleTime: 10_000,
  preloadStaleTime: 10_000,
  preload: true,
})

function AgentChatIdRoute() {
  const { chat, agentId } = Route.useLoaderData()

  return (
    <>
      <BaseChat
        key={chat.id}
        id={chat.id}
        agentId={agentId}
        endpoint={`/api/agents/custom/${agentId}`}
        initialMessages={convertToUIMessages(chat.messages)}
        selectedVisibilityType={chat.visibility}
        isReadonly={false}
        isAgent
      />
    </>
  )
}
