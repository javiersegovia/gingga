import type { Route } from './+types/index'
import { nanoid } from 'nanoid'
import { href, redirect, useParams } from 'react-router'
import { BaseChat } from '~/features/chat/components/base-chat'

export function loader({ params }: Route.LoaderArgs) {
  if (!params.agentId) {
    return redirect(href('/chat/agents'), 302)
  }
  return { agentId: params.agentId }
}

export default function AgentChatRoute() {
  const { agentId } = useParams()
  const chatId = nanoid()

  return (
    <>
      <BaseChat
        key={chatId}
        id={chatId}
        agentId={agentId}
        endpoint={`/api/agents/custom/${agentId}`}
        initialMessages={[]}
        selectedVisibilityType="private"
        isReadonly={false}
        isNewChat
        isAgent
      />
    </>
  )
}
