import type { Route } from './+types/index'
import { nanoid } from 'nanoid'
import { href, redirect } from 'react-router'
import { BaseChat } from '~/features/chat/components/base-chat'

export function loader({ params }: Route.LoaderArgs) {
  if (!params.agentId) {
    return redirect(href('/agents'), 302)
  }
  return { agentId: params.agentId, chatId: nanoid(), endpoint: `/api/agents/custom/${params.agentId}` }
}

export default function AgentChatRoute({ loaderData }: Route.ComponentProps) {
  const { agentId, chatId, endpoint } = loaderData

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
      />
    </>
  )
}
