import type { Route } from './+types/$chatId'
import { href, redirect } from 'react-router'
import { getAgentById } from '~/features/agent/agent.service'
import { getChatById } from '~/features/chat/chat.service'
import { BaseChat } from '~/features/chat/components/base-chat'
import { convertToUIMessages } from '~/lib/utils'

export async function loader({ params }: Route.LoaderArgs) {
  const agent = await getAgentById(params.agentId)

  if (!agent) {
    return redirect(href('/agents'))
  }

  const chat = await getChatById({ id: params.chatId })

  if (!chat) {
    return redirect(href('/agent/:agentId', { agentId: params.agentId }))
  }

  return { chat, agent, agentId: params.agentId, endpoint: `/api/agents/custom/${params.agentId}` }
}

export default function AgentChatIdRoute({ loaderData }: Route.ComponentProps) {
  const { chat, agentId, agent, endpoint } = loaderData

  return (
    <>
      <BaseChat
        key={chat.id}
        id={chat.id}
        agentId={agentId}
        agent={agent}
        endpoint={endpoint}
        initialMessages={convertToUIMessages(chat.messages)}
        selectedVisibilityType={chat.visibility}
        isReadonly={false}
      />
    </>
  )
}
