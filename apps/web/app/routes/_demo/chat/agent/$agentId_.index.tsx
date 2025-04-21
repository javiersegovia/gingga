import { createFileRoute, redirect } from '@tanstack/react-router'
import { nanoid } from 'nanoid'
import { BaseChat } from '~/features/chat/components/base-chat'
import { agentQueryOptions } from '~/features/agent/agent.query'

export const Route = createFileRoute('/_demo/chat/agent/$agentId_/')({
  component: AgentChatRoute,
  loader: async ({ params, context: { queryClient } }) => {
    try {
      queryClient.prefetchQuery(agentQueryOptions(params.agentId))
      return { agentId: params.agentId }
    } catch (error) {
      console.error('Error ensuring agent data:', error)
      throw redirect({ to: '/chat/agents' })
    }
  },
})

function AgentChatRoute() {
  const { agentId } = Route.useParams()
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
