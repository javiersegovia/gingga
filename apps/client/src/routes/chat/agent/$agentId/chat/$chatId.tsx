import type { Route } from './+types/$chatId'
import { href, redirect } from 'react-router'
import { getChatById } from '~/features/chat/chat.service'
import { BaseChat } from '~/features/chat/components/base-chat'
import { convertToUIMessages } from '~/lib/utils'

export async function loader({ params }: Route.LoaderArgs) {
  const chat = await getChatById({ id: params.chatId })

  if (!chat) {
    return redirect(href('/chat/agent/:agentId', { agentId: params.agentId }))
  }

  return { chat, agentId: params.agentId, endpoint: `/api/agents/custom/${params.agentId}` }
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
      />
    </>
  )
}
