import type { Route } from './+types/instructions'
import type { AgentFormValues } from '~/features/agent/agent.schema'
import { useUpdateAgentMutation } from '~/features/agent/agent.query'
import { getAgentById } from '~/features/agent/agent.service'
import { AgentForm } from '~/features/agent/components/agent-form'

export async function loader({ params }: Route.LoaderArgs) {
  if (!params.agentId) {
    throw new Error('Agent ID is required')
  }
  const agent = await getAgentById(params.agentId)

  if (!agent) {
    throw new Error('Agent not found')
  }

  return { agent, agentId: params.agentId }
}

export default function RouteComponent({ loaderData }: Route.ComponentProps) {
  const { agent, agentId } = loaderData
  const updateAgentMutation = useUpdateAgentMutation()

  const handleSubmit = async (values: AgentFormValues) => {
    await updateAgentMutation.mutateAsync({ ...values, id: agentId })
  }

  return (
    <AgentForm
      initialValues={agent}
      onSubmit={handleSubmit}
      isSubmitting={updateAgentMutation.isPending}
    />
  )
}
