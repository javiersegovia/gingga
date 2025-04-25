import type { ChatMessage } from '@gingga/db/types'
import type { Attachment, UIMessage } from 'ai'
import type { Route } from './+types/$chatId'
import { getChatById } from '@gingga/api/features/chat/chat.service'
import { href, redirect } from 'react-router'
import { BaseChat } from '~/features/chat/components/base-chat'
import { webEnv } from '~/lib/env.server'

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

export async function loader({ params }: Route.LoaderArgs) {
  const chat = await getChatById({ id: params.chatId })

  if (!chat) {
    return redirect(href('/chat/agent/:agentId', { agentId: params.agentId }))
  }

  return { chat, agentId: params.agentId, endpoint: `${webEnv.VITE_API_URL}/api/agents/custom/${params.agentId}` }
}

export default function AgentChatIdRoute({ loaderData }: Route.ComponentProps) {
  const { chat, agentId, endpoint } = loaderData

  return (
    <>
      <BaseChat
        key={chat.id}
        id={chat.id}
        agentId={agentId}
        endpoint={endpoint}
        initialMessages={convertToUIMessages(chat.messages)}
        selectedVisibilityType={chat.visibility}
        isReadonly={false}
        isAgent
      />
    </>
  )
}
