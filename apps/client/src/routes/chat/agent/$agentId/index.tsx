import type { Route } from './+types/index'
import { nanoid } from 'nanoid'
import { href, redirect } from 'react-router'
import { BaseChat } from '~/features/chat/components/base-chat'

export function loader({ params }: Route.LoaderArgs) {
  if (!params.agentId) {
    return redirect(href('/chat/agents'), 302)
  }
  return { agentId: params.agentId, endpoint: `/api/agents/custom/${params.agentId}` }
}

export default function AgentChatRoute({ loaderData }: Route.ComponentProps) {
  const { agentId, endpoint } = loaderData
  const chatId = nanoid()

  return (
    <>
      <BaseChat
        key={chatId}
        id={chatId}
        agentId={agentId}
        endpoint={endpoint}
        initialMessages={[]}
        selectedVisibilityType="private"
        isReadonly={false}
        isNewChat
        isAgent
      />
    </>
  )
}
