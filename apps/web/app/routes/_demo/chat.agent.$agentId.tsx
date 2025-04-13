import { createFileRoute, redirect } from '@tanstack/react-router'
import { createId } from '@paralleldrive/cuid2'
import { BaseChat } from '@/features/chat/components/base-chat'
import { agentQueryOptions } from '@/features/agent/agent.query'

export const Route = createFileRoute('/_demo/chat/agent/$agentId')({
  component: AgentChatRoute,
  loader: async ({ params, context: { queryClient } }) => {
    try {
      await queryClient.ensureQueryData(agentQueryOptions(params.agentId))

      return { agentId: params.agentId }
    } catch (error) {
      console.error('Error ensuring agent data:', error)
      throw redirect({ to: '/chat/agents' })
    }
  },
})

function AgentChatRoute() {
  const { agentId } = Route.useParams()
  const chatId = createId()

  return (
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
  )
}
