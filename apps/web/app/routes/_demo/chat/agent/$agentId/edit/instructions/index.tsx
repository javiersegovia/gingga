import type { AgentFormValues } from '~/features/agent/agent.schema'
import { createFileRoute } from '@tanstack/react-router'
import { $getAgentById } from '~/features/agent/agent.api'
import { useUpdateAgentMutation } from '~/features/agent/agent.query'
import { AgentForm } from '~/features/agent/components/agent-form'

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
  }

  return (
    <AgentForm
      initialValues={agent}
      onSubmit={handleSubmit}
      isSubmitting={updateAgentMutation.isPending}
    />
  )
}
