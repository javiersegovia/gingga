import { createFileRoute } from '@tanstack/react-router'
import { AgentForm } from '~/features/agent/components/agent-form'
import { useUpdateAgentMutation } from '~/features/agent/agent.query'
import { $getAgentById } from '~/features/agent/agent.api'
import type { AgentFormValues } from '~/features/agent/agent.schema'

export const Route = createFileRoute('/_demo/chat/agent/$agentId/edit/instructions/')({
  loader: async ({ params }: { params: { agentId: string } }) => {
    const agent = await $getAgentById({ data: { id: params.agentId } })
    if (!agent) {
      throw new Error('Agent not found')
    }
    return { agent }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { agent } = Route.useLoaderData()
  const params = Route.useParams()

  const updateAgentMutation = useUpdateAgentMutation()

  const handleSubmit = async (values: AgentFormValues) => {
    await updateAgentMutation.mutateAsync({ data: { ...values, id: params.agentId } })
    console.log('Agent instructions updated!')
  }

  return (
    <AgentForm
      initialValues={agent}
      onSubmit={handleSubmit}
      isSubmitting={updateAgentMutation.isPending}
    />
  )
}
